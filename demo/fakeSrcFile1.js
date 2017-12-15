const fs = require('fs');
const path = require('path');
var readline = require('readline');
var stream = require('stream');

const dev = require('DEVision.js');

IMPORTANT :
USER NEEDS TO INPUT LOCATION OF nnCL CONFIG FILE: 
const configFile = path.join(__dirname, '../fileMonitoring/nnCL.config.json'); /**!**/

console.log('\n\n\n\n *********************************************');

function getFileStream(fileName) {
  return new Promise((resolve, reject) => {
    let filePath = fs.realpathSync(fileName);

    console.log('\nACCESSING >>>>>>>>>>>>>> :\n', filePath, '\n');

    const readableStream = fs.createReadStream(filePath);
    let data = '';

    readableStream
      .on('data', (chunk) => {
        data += chunk;
      })
      .on('end', () => {
        return resolve(data);
      });
  })
}


dev.test(getFileStream, 
  [ 
    {
      input: 1204/*1204*/,
      type: 'ok',
      expected: 'value',
      msg: 'description',
    },
    {
      input: 3527,
      type: 'equal',
      expected: 3527,
      msg: 'description'/*1204*/,
    }
  ],
  dev.end
);

dev.test(getGitIgnore, 
  [ 
    {
      value: 1204/*1204*/,
      type: 'ok',
      expected: 'value',
      msg: 'description',
    },
    {
      input: 3527,
      type: 'equal',
      expected: 3527,
      msg: 'description'/*1204*/,
    }
  ],
  dev.end
);




function getGitIgnore(fileName) { // To access .gitIgnore file to grab files/folders to ignore
  return new Promise(async (resolve, reject) => {
    try {
      let ignoreMap = new Map();
      ignoreMap.set('.gitignore');
      ignoreMap.set('.DS_Store');
      ignoreMap.set('.vscode');
      let data = await getFileStream('.gitignore');
      data = data.split(require('os').EOL);

      for (let i = 0; i < data.length; i++) {
        if (data[i].length >= 1) ignoreMap.set(data[i]);
      }

      console.log('IGNOREMAP >>> : ', ignoreMap, '\n');

      resolve(ignoreMap);

    } catch (error) {
      reject(error);
    }
  })
}


function traverseDir() {
  return new Promise(async (resolve, reject) => {
    const dirPath = './';                              // ROOT FOLDER PATH
    let ignoreMap = await getGitIgnore();              // to ignore these folders/files (MAP type)
    let fileExtensionsMap = await getFileExtensions(); // to only grab these file extensions (MAP type)

    function walkSync(dir) { // NOT ASYNC -- however won't impact user at run-time
      if (fs.statSync(dir).isDirectory() && !ignoreMap.has(dir)) {
        return fs.readdirSync(dir).map(file => walkSync(path.join(dir, file)))
          .filter(file => file)
          .forEach(file => {
            console.log(file);

            // PARSING LOGIC GOES HERE 
            // currently writing/testing logic in seperate file

          });
      } else if (fs.statSync(dir).isFile() && !ignoreMap.has(dir) && fileExtensionsMap.has(dir.slice(dir.lastIndexOf('.')))) {
        return dir;
      }
    }

    return resolve(walkSync(dirPath));
  });
}

async function getRelevantFiles() {
  let relevant = await traverseDir(); // unfiltered: contains undefined 
  // console.log('\n\n\nTRAVERSING DIR >>>>>>>>>>> \n', relevant);
  console.log('\n\n\n\n *********************************************');
  return relevant;
}

getRelevantFiles();



nnCL.test(objectToTest55, 
  {
    input: 3669,
    type: 'deepEqual',
    expected: 'value',
    msg: 'description',
  },
  nnCL.end
);


nnCL.test(objectToTest55, 
  [
    {
      input: 2446,
      type: 'deepEqual',
      expected: 'value',
      msg: 'description',
    },
    {
      value: 2446,
      type: 'notOk',
      msg: 'description',
    },
  ],
  nnCL.end
);


nnCL.test(objectToTest17, 
  {
    input: 1045,
    type: 'equal',
    expected: 1045,
    msg: 'description',
  },
  nnCL.end
);


module.exports = {
  getFileStream,
  getFileExtensions,
  getRelevantFiles,
}