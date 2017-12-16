const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

// IMPORTANT : -- not used at the moment
// USER NEEDS TO INPUT LOCATION OF devision.js CONFIG FILE: 
// const configFile = path.join(__dirname, '../fileMonitoring/dev.config.json'); /**!**/

traverseDir();

async function traverseDir() {
  const rootDir = './';                              // ROOT FOLDER PATH
  let ignoreMap = await getGitIgnore();              // to ignore these folders/files (MAP type)
  // let fileExtensionsMap = await getFileExtensions(); // to only grab these file extensions (MAP type)

  try {                                              // check for test folder
    fs.statSync(rootDir + 'DEV_Tests');
  } catch (e) {                                      // if doesn't exist: make a test folder 
    fs.mkdirSync(rootDir + 'DEV_Tests');
  }

  function recurseDir(dir) {
    if (fs.statSync(dir).isDirectory() && !ignoreMap.has(dir)) {
      return fs.readdirSync(dir)
      .map(file => recurseDir(path.join(dir, file)))
      .filter(file => file)
      .forEach(async (file) => {

        let fileContent = await getFileContent(file).replace(/[ \t]/g, '');
        if (fileContent.indexOf('.test(') !== -1 || fileContent.indexOf('.all(') !== -1) {  
          fileContent = commentsBeGone(fileContent);
          
          if (fileContent.indexOf("require('devision.js')") !== -1) {
            let exporting = await exportTestCases(file, fileContent);
          } else if (fileContent.indexOf('require("devision.js")') !== -1) {
            let exporting = await exportTestCases(file, fileContent);
          } else if (fileContent.indexOf('require(`devision.js`)') !== -1) {
            let exporting = await exportTestCases(file, fileContent);
          } 
        }
      });

    } else if (fs.statSync(dir).isFile() && !ignoreMap.has(dir) /*&& fileExtensionsMap.has(dir.slice(dir.lastIndexOf('.')))*/) {
      return dir;
    }
  }

  return recurseDir(rootDir);
}

function exportTestCases(srcFile, fileContent) {
  const testFile = getTestFileName(srcFile);
  const outstream = fs.createWriteStream(testFile);
  outstream.write(`const srcFile = require('../${srcFile}'); \nconst test = require('tape');\n`);

  let declaration; // if `const ${declaration} = require('DEVision.js');`
  let requirement; // purpose: to keep track of '/"/`

  if (fileContent.indexOf("require('devision.js')") !== -1) {
    requirement = "require('devision.js')";
  } else if (fileContent.indexOf('require("devision.js")') !== -1) {
    requirement = 'require("devision.js")';
  } else if (fileContent.indexOf('require(`devision.js`)') !== -1) {
    requirement = 'require(`devision.js`)';
  }

  let idx = fileContent.indexOf(requirement);
  if (fileContent.indexOf(requirement + '.test(') !== -1 || fileContent.indexOf(requirement + '.all(') !== -1) {
    declaration = requirement;

  } else {
    let declarationLine = fileContent.slice(0, idx).split(os.EOL).slice(-1)[0];
   
    if (declarationLine.lastIndexOf(';') !== -1) declarationLine = declarationLine.slice(declarationLine.lastIndexOf(';') + 1);
    /* ex: const fs = require('fs'); const devision.js = */

    else if (declarationLine.lastIndexOf(',') !== -1) declaration = declarationLine.slice(declarationLine.lastIndexOf(',') + 1, -1);
    /* ex: const fs = require('fs'), devision.js = */
    
    else if (declarationLine.slice(0, 3) === 'let' || declarationLine.slice(0,3) === 'var') declaration = declarationLine.slice(3, -1);
    else if (declarationLine.slice(0, 5) === 'const') declaration = declarationLine.slice(5, -1);
  }

  fileContent = fileContent.slice(idx);
  let testStart = declaration + '.test(';
  let allStart = declaration + '.all(';
  let ending = declaration+ '.end';
  let head; // + head.length 
  let headLength;
  let tail;
  let prevTestObj;

  function parseRecurse(string) {
    let testIdx = string.indexOf(testStart);
    let allIdx = string.indexOf(allStart);
    tail = string.indexOf(ending);

    if (testIdx !== -1) {
      if (allIdx === -1) {
        head = testIdx;
        headLength = testStart.length;
      }
      else if (testIdx < allIdx) {
        head = testIdx;
        headLength = testStart.length;
      }
    }

    if (allIdx !== -1) {
      if (testIdx === -1) {
        head = allIdx;
        headLength = allStart.length;
      }
      else if (allIdx < testIdx) {
        head = allIdx;
        headLength = allStart.length;
      }
    }

    // only thing left is the tail: no more to parse - quit
    if ((head === -1) && (tail !== -1)) return;

    // tail/head exists and tail is before head: (slice until next head)
    else if ((tail !== -1) && (head !== -1) && (tail < head)) {
      return parseRecurse(string.slice(head));

      // head/tail exists and head is before tail: (GRAB INBETWEEN TO EXPORT then slice)
    } else if ((head !== -1) && (tail !== -1) && (head < tail)) {
      let relevant = string.slice(head + headLength, tail).slice(0, -1);
      let currTestObj = relevant.slice(0, relevant.indexOf(','));
      relevant = relevant.slice(relevant.indexOf(',') + 1);

      if (relevant[0] === '[') {
        let testCases = eval(relevant);
        testCases.forEach(testCase => {
          writeTestCase(testCase);
        });

      } else {
        let testCase = eval('(' + relevant + ')');
        writeTestCase(testCase);
      }

      function writeTestCase(testCase) {
        /* to check and only write "test(___ ()=> { " once */
        if (!prevTestObj) {
          prevTestObj = currTestObj;
          outstream.write(`\ntest('TESTING ${currTestObj}', (t) => {`);

        } else if (prevTestObj !== currTestObj) {
          prevTestObj = currTestObj;
          outstream.write(`\n\tt.end();\n});`);
          outstream.write(`\n\ntest('TESTING ${currTestObj}', (t) => {`);
        }

        let msg = '';  // incase they don't include test description
        if (testCase.msg) msg = testCase.msg;
        if (testCase.type === 'equal' || testCase.type === 'notEqual' || testCase.type === 'deepEqual' || testCase.type === 'notDeepEqual' || testCase.type === 'deepLooseEqual' || testCase.type === 'notDeepLooseEqual') {
          outstream.write(`\n\tt.${testCase.type}(srcFile.${currTestObj}(${JSON.stringify(testCase.input)}), ${JSON.stringify(testCase.expected)}, "${msg}");`);
        }
        if (testCase.type === 'ok' || testCase.type === 'notOk') outstream.write(`\n\tt.${testCase.type}(${JSON.stringify(testCase.input)}, "${msg}");`);
        if (testCase.type === 'error') outstream.write(`\n\tt.${testCase.type}((${JSON.stringify(testCase.e)}), "${msg}");`);
        if (testCase.type === 'comment') outstream.write(`\n\tt.${testCase.type}("${msg}");`);
      }

      return parseRecurse(string.slice(tail));
    }
  }
  
  parseRecurse(fileContent.split(os.EOL).join(''));
  outstream.write(`\n\tt.end();\n});`);
  outstream.end();
  return;
}












/********************  HELPER FUNCTIONS :  **********************/

function getFileContent(fileName) {
  try {
    let filePath = fs.realpathSync(fileName);
    // console.log('\nACCESSING >>>>>>>>>>>>>> :\n', filePath, '\n');
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    return content;

  } catch (error) {
    console.log('getFileContent>>>', error); // can do two try-catches but it's fine
  }
}

async function getGitIgnore(fileName) { // To access .gitIgnore file to grab files/folders to ignore
  try {
    let ignoreMap = new Map();
    ignoreMap.set('.gitignore');
    ignoreMap.set('.DS_Store');
    ignoreMap.set('.vscode');
    ignoreMap.set('webpack.config.js');
    ignoreMap.set('DEV_Tests');
    ignoreMap.set('devision');
    ignoreMap.set('README.md');

    let data = await getFileContent('.gitignore');
    data = data.split(os.EOL);
    data.forEach(ele => { if (ele.length >= 1) ignoreMap.set(ele) })

    return ignoreMap;

  } catch (error) {
    console.log('gitGitIgnore: >>>', error)
  }
}

// async function getFileExtensions() { // To access config file to grab file extensions to filter for
//   try {
//     let data = await getFileContent(configFile);
//     data = JSON.parse(data).extensions;

//     let extensionsMap = new Map();
//     data.forEach(ele => extensionsMap.set(ele));

//     return extensionsMap;

//   } catch (error) {
//     console.log('getFileExtensions: >>>', error)
//   }
// }

function getTestFileName(srcFile) {
  let slashIdx = srcFile.lastIndexOf('/');
  let dotIdx = srcFile.lastIndexOf('.');
  let fileName = srcFile.slice(slashIdx + 1, dotIdx);
  let testPath = './DEV_Tests/' + fileName + '.test.js';
  return testPath;
}

function commentsBeGone(str) {
  let idx = str.indexOf('//'); 
  if (idx !== -1) {
    let rest = str.slice(idx);
    rest = rest.slice(rest.indexOf(os.EOL));
    return commentsBeGone(str.slice(0, idx) + rest);
  }

  idx = str.indexOf('/*')
  let end = str.indexOf('*/');
  if (idx !== -1 && end !== -1) return commentsBeGone(str.slice(0, str.indexOf('/*')) + str.slice(str.indexOf('*/') + 2));

  return str;
}