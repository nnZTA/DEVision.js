//  CS-Demo-dev-MapData
'use strict';


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//  CS-Demo-REST-StockMarket
'use strict';
window.onload = () => {

// dev.log(["app START", window.performance.now().toFixed(4)],0,'appRunTime');
// dev.log(["IN CS-Demo-REST-StockMarket", window.performance.now().toFixed(4)],0,'global');

dev.log(["IN CS-Demo-REST-StockMarket && app START", window.performance.now().toFixed(4)],0,['global', 'appRunTime']);


const stockURLprefix = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=';
const stockURLsuffix = '&interval=1min&outputsize=compact&apikey=CVAEBYTRXE2YN90V';

let tickerArray = ['AAPL', 'GOOG', 'MSFT', 'ORCL', ]
// dev.log(["tickerArray[", tickerArray.length, "] === ", tickerArray]);
let tickerData = new Map();

function    httpGetAsync (theUrl, callback, ...cbArgs) {   // when the async operation is complete the callback function is executed with the async results passed into callback
        var xmlHttp = new XMLHttpRequest();

        //  onreadystatechange
        //    https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
        xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText, ...cbArgs);
        }
        xmlHttp.open("GET", theUrl, true);  // true for asynchronous ... note:  the option to have a "choice (t/f)" is actually deprecated if you read the tech doc...  i.e. should always be true
        xmlHttp.send(null);
    }
    
    
    
function fnSaveStocks (responseText, ...cbArgs) {
  dev.log(["IN fnSaveStocks (", cbArgs[0], ")"],0,'dataIO');
  dev.log(["IN fnSaveStocks @ ", window.performance.now().toFixed(4)],0,'global');
  dev.log(["cbArgs[0] === ", cbArgs[0]]);
  
  let responseObj = JSON.parse(responseText);
  let truncatedObj = {};
  truncatedObj['Meta Data'] = Object.assign({}, responseObj['Meta Data']);
  let timeDataObj = Object.assign({}, responseObj['Time Series (1min)']);
  truncatedObj['Time Series (1min)'] = {};
  for (let i = 0; i < 3; i += 1){
    // dev.log(["truncatedObj >>> i === ", i]);

    truncatedObj['Time Series (1min)'][Object.keys(timeDataObj)[i]] = 
    Object.assign({}, timeDataObj[ Object.keys(timeDataObj)[i] ]);

    // dev.log(["truncatedObj['Time Series (1min)'] === ", truncatedObj['Time Series (1min)']]);
  }
    
  // tickerData.set(cbArgs[0], JSON.parse(responseText));
  tickerData.set(cbArgs[0], truncatedObj);
  dev.log(["tickerData.get(cbArgs[0]) === ", tickerData.get(cbArgs[0])]);
}    
    
function fnGetStocks () {
  dev.log(["IN fnGetStocks @ ", window.performance.now().toFixed(4)],0,'global');
  for (let i = 0; i < tickerArray.length-0; i += 1) {
    let stockURL = stockURLprefix + tickerArray[i] + stockURLsuffix;
    dev.log(["httpGetAsync for tickerArray[", i, "] === ", tickerArray[i]]);
    dev.log(["stockURL[", stockURL.length, "] === ", stockURL]);
    httpGetAsync (stockURL, fnSaveStocks, tickerArray[i])
  }
}

function fnPingStocks (interval) {
  dev.log(["IN fnPingStocks", window.performance.now().toFixed(4)],0,'global');
  return setInterval( () => {
    dev.log("_______________________________________________________________");
    dev.log(["IN fnPingStocks >>> setInterval", window.performance.now().toFixed(4)]);
    dev.log(["stockIntervalCount === " + stockIntervalCount]);
    fnGetStocks ();
    stockIntervalCount += 1;
    dev.log(["stockIntervalCount === ", stockIntervalCount]);
    if (stockIntervalCount > stockIntervalMax) {
      dev.log("IN if (stockIntervalCount >= stockIntervalMax - 1)");
      clearInterval(stockInterval);
      // dev.log(["app END", window.performance.now().toFixed(4)],0,'appRunTime');
      // dev.log(["app END", window.performance.now().toFixed(4)],0,'newEndScope');
      dev.log(["IN CS-Demo-REST-StockMarket && app END", window.performance.now().toFixed(4)],0,['global', 'appRunTime', 'newEndScope' ]);
      
    }
  }, interval);
}


function mapToJson(map) {
    return JSON.stringify([...map]);
}
function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}




//gets all the data and appends them on saved scopes i.e. "appRunTime", "global", "dataIO"
function updateViewer() {
  console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV _______________________________");
  console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV _______________________________");
  console.log(["IN setTimeout", window.performance.now().toFixed(4)]);
  console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV _______________________________");
  console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV _______________________________");
  let vwData = dev.consoleData;

  console.log("vwData ===", vwData);     //   vwData is a Map object, where the 'key' is the timestamp, and the 'value' is the logged string
  
  console.log("_______________________________ VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
  console.log("_______________________________ VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");


  // vwData.forEach(appendMapElements);
  // vwData.forEach( (value, key, map, scope) => {
  //     appendMapElements(value, key, map, "Console", 'console.log');
  // });
  for (let node = vwData.head; node; node = node.next) {                        // vwData.forEach( (value, key, map, scope) => {
      appendMapElements(node.data, node.ts, 'Tab1', 'Console', node.idx);
  };
  console.log("_______________________________ VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
  console.log("_______________________________ VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");

}




let stockIntervalCount = 0;
fnGetStocks ();
stockIntervalCount += 1;
let stockIntervalMax   = 1;

let testDelay = 21; // in seconds
let stockInterval = fnPingStocks (testDelay*1000); // one minute
setTimeout( () => {
  dev.log(["IN setTimeout", window.performance.now()],0,'global');
  dev.log("_______________________________________________________________");
  dev.log("_______________________________________________________________");
  dev.log("_______________________________________________________________");
  dev.log("tickerData ===");
  dev.log([tickerData]);

  // dev.log("__________ to JSON >>> >>> >>>");
  // dev.log([JSON.stringify(tickerData)]);
  //  NOTE ~~ JSON.stringify(tickerData) ~~ does not work on Map Objects
  dev.log("__________ to JSON >>> >>> >>>");
  dev.log(mapToJson(tickerData));
  dev.log("__________ back to Map >>> >>> >>>");
  dev.log(jsonToMap(mapToJson(tickerData)));

  
  dev.log("_______________________________ |||||||||||||||||||||||||||||||");
  dev.log("_______________________________ |||||||||||||||||||||||||||||||");
  dev.log("_______________________________ |||||||||||||||||||||||||||||||");
  
  // console.log("mapToJson(dev.consoleData._storage) ===");
  // console.log(mapToJson(dev.consoleData._storage));

  console.log("_______________________________ TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  console.log("dev.consoleData ===");
  console.log(dev.consoleData);

  
  //BenNote ~ START ~ This code needs moved to the [addTab] button form
  console.log("_______________________________ TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  console.log("dev.watcher._catalog['", dev.watcher._catalog.size, "'] ===", dev.watcher._catalog);
  
    let scopesSymbol = dev.watcher._catalog.keys();
  let scopesArray = [];
  for(let i = 0; i < dev.watcher._catalog.size; i += 1) {
      scopesArray.push(Symbol.keyFor(scopesSymbol.next().value));
  }

  
  console.log("scopesArray['", scopesArray.length, "'] ===", scopesArray);
  // scopesArray contains all the scopes defined by the developer (for a drop-down and/or error check)

  //Ben SubNote ~ you will only need the first of the following three code blocks...
  // console.log("_______________________________ TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  // let showScope = 'appRunTime'; // 'appRunTime' should come from a webForm or CLI
  // console.log("dev.watchDump('", showScope, "') ===");
  // let watchDump = dev.watchDump(showScope);
  // console.log(watchDump);
  // let newTabID = newTab(showScope);
  // console.log("newTabID === ", newTabID);
  // watchDump.forEach( function (value, key, map, scope) {
  //   appendMapElements(value, key, map, newTabID, showScope);
  // });  

  //BenNote ~ END

  // console.log("_______________________________ TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  // console.log("dev.watcher ===");
  // console.log(dev.watcher);
  console.log("_______________________________ TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  console.log("_______________________________ TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  console.log("_______________________________ TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");


    //  note the function   updateViewer()   is in the   htmlViewer.js   file
    updateViewer();

    
    setInterval(()=>{
        dev.log("IN [app.js] TEST Live IMPORTANT ... window.performance.now() === " + window.performance.now().toFixed(4), 2, 'bar');
    }, 2000);

}, (stockIntervalMax + 0.5) * testDelay * 2000);
// }, (stockIntervalMax + ((testDelay >= 30) ? .25 : 10))*testDelay*1000);


setInterval(()=>{
  dev.log("IN [app.js] TEST Live Log ... window.performance.now() === " + window.performance.now().toFixed(4), 0, 'foo');
}, 2000);


}  // closing brace for window.onload ... ☺