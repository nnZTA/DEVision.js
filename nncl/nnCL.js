//  nnCL NinjaNineConsoleLog
'use strict';

let _DoubleLinkedList;

if (typeof window === 'undefined' && typeof process !== 'undefined') {
  // check to see if this is a node environment, since there is no DoubleLinkedList 
  _DoubleLinkedList = require('./linkedList.js');
}
else {
  _DoubleLinkedList = DoubleLinkedList;
}

Array.prototype.arrayHasIntersection = function (compareToArr) {  
  for (let i = 0; i < compareToArr.length; i += 1) {
    for (let j = 0; j < this.length; j += 1) {
      if (compareToArr[i] === this[j]) return true;
    }
  }
  return false;
}

class MapQueueSymbol {
  constructor (maxCountDesired = -1) {
    this._catalog = new Map();
    this._storage = new Map();
  }
  
  enqueue(data, scope) {
    let catalogSymbol = Symbol.for(scope);
    // console.log("******>>> ", catalogSymbol, "for", scope);
    let dataSymbol = Symbol.for(window.performance.now().toFixed(4));
    this._storage.set(dataSymbol, data);
    let dataQueue = this._catalog.get(catalogSymbol);
    if (!dataQueue) {
      this._catalog.set(catalogSymbol, {symbolData: new _DoubleLinkedList(10)});
      dataQueue = this._catalog.get(catalogSymbol);
    }
    dataQueue.symbolData.addLast(dataSymbol);
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> scope appendMapElements", typeof appendMapElements);  
    if (nnCL.viewerActive && typeof appendMapElements !== 'undefined' && nnCL.scopeViews.get(scope) && ( (nnCL.scopeViews.get(nnCL.viewerTabCurrent)) ? nnCL.scopeViews.get(nnCL.viewerTabCurrent).autoRefresh : true)) {
      console.log(data, Symbol.keyFor(dataSymbol), nnCL.scopeViews.get(scope).viewName, scope, dataQueue.symbolData.tail.idx);
      appendMapElements(data, Symbol.keyFor(dataSymbol), nnCL.scopeViews.get(scope).viewName, scope, dataQueue.symbolData.tail.idx);
    }
      // nnCL.scopeViewer
      // scopeViews.set(objName, {Obj:undefined, viewName
  }
  
  getOneScope(scope) {
    let returnMap;
    let dataQueue = this._catalog.get( Symbol.for(scope) );
    if (dataQueue) {
      returnMap = new Map();
      for (let node = dataQueue.symbolData.head; node; node = node.next) {
        returnMap.set( Symbol.keyFor(node.data),{ scopeIDX:node.idx, logData:this._storage.get( node.data )});
      }
      // for (let i = 0; i < dataQueue.length; i += 1) {
      //   returnMap.set( Symbol.keyFor(dataQueue[i]), this._storage.get( dataQueue[i] ));
      // }
    }
    return returnMap;
  }
}

class MapQueue {
  constructor (maxCountDesired = -1) {
    this._storage = new Map();
  }
  
  enqueue(data) {
    this._storage.set(window.performance.now().toFixed(4), data);
  }
}


class nn_CL {
  constructor () {
    this.blnSkipAll = false;
    this.currentPriority = 0;
    this.currentScope = ['global', 'appRunTime', 'dataIO', 'newEndScope', 'foo', 'bar',  ];
    this.watcher = new MapQueueSymbol();
    // this.consoleData = new MapQueue();
    this.consoleData = new _DoubleLinkedList(50);
    this.trackedObjects = new Map();
    this.scopeViews = new Map();
    this.viewerActive = false;
    this.viewerTabCount = 0;
    this.viewerTabCurrent;
    this.viewerTabCurrentType;
    this.end = Symbol.for('5a20286cd4e5aefb503d46235a20286d237ea5e45cff8abc'); // Jac's parsing placeholder ☺ ... should be the final argument for all watch() & test() functions
    // 5a20286cd4e5aefb503d4623 GUID from  NinjaNineServer  on Thu Nov 30 2017 10:49:00 GMT-0500 (Eastern Standard Time) from ObjectId();Date(); (MongoDB 3.4.10)
    // 5a20286d237ea5e45cff8abc GUID from  GeoTech (Laptop) on Thu Nov 30 2017 10:49:01 GMT-0500 (Eastern Standard Time) from ObjectId();Date(); (MongoDB 3.4.9 )
    // Collision Rate for Jac...    1  -in-  5.041e+74    ... yep, that's a 5 with 74 zeros after it 🐉
}
  
  log(logMsg, priority = 0, scope) {
    // if (priority >= this.currentPriority && (!scope || (-1 !== this.currentScope.indexOf(scope)))) {
    if (priority >= this.currentPriority || (!scope || (Array.isArray(scope)) ? scope.arrayHasIntersection(this.currentScope) : (-1 !== this.currentScope.indexOf(scope)))) {
      
      console.log(logMsg);
      if (Array.isArray(logMsg)){
        let logString = '';
        for (let i = 0; i < logMsg.length; i += 1) {
          if (typeof logMsg[i] === 'object'){
            logString += JSON.stringify(logMsg[i], null, 2) + ' ';
          }
          else {
            logString += logMsg[i] + ' ';
          }
        }
        this.consoleData.addLast(logString);
        if (Array.isArray(scope)) {
          for (let i = 0; i < scope.length; i += 1) {
            this.watcher.enqueue(logString, scope[i]);
          }
        }
        else if (scope) {
          this.watcher.enqueue(logString, scope);
        }
      }
      else if (typeof logMsg === 'object'){
        this.consoleData.addLast(JSON.stringify(logMsg, null, 2));
        if (Array.isArray(scope)) {
          for (let i = 0; i < scope.length; i += 1) {
            this.watcher.enqueue(JSON.stringify(logMsg, null, 2), scope[i]);            
          }
        }
        else if (scope) {
          this.watcher.enqueue(JSON.stringify(logMsg, null, 2), scope);
        }
      }
      else {
        this.consoleData.addLast(logMsg);
        if (Array.isArray(scope)) {
          for (let i = 0; i < scope.length; i += 1) {
            this.watcher.enqueue(logMsg, scope[i]);            
          }
        }
        else if (scope) {
          // console.log("IN [nnCL.js] >>> else if (scope) >>>", logMsg, priority, logString, scope);
          console.log("IN [nnCL.js] >>> else if (scope) >>>", logMsg, priority, scope);
          this.watcher.enqueue(logMsg, scope);
        }
      }
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> log appendMapElements", typeof appendMapElements); 
      let ternaryResult = ( (this.scopeViews.get(this.viewerTabCurrent)) ? this.scopeViews.get(this.viewerTabCurrent).autoRefresh : true); 
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ternary result", ternaryResult);  
      if (this.viewerActive && typeof appendMapElements !== 'undefined' && ( (this.scopeViews.get(this.viewerTabCurrent)) ? this.scopeViews.get(this.viewerTabCurrent).autoRefresh : true))
        appendMapElements(nnCL.consoleData.tail.data, nnCL.consoleData.tail.ts, 'Tab0', 'Console', nnCL.consoleData.tail.idx);
    }
  }
  
  watch (item) {
    let copy = Object.assign({}, item);
    this.watcher.push({item:copy, ts:Date()});
  }
  
  watchDump(scope){
    console.log("IN watchDump(", scope, ") >>>");
    try {
      if (scope) {
        // console.log("typeof this.watcher === ", typeof this.watcher);
        // console.log("typeof this.watcher.getOneScope === ", typeof this.watcher.getOneScope);
        // console.log("this.watcher._storage === ", this.watcher._storage);
        // console.log("this.watcher._catalog === ", this.watcher._catalog);
        let dataDump = this.watcher.getOneScope(scope);
        // console.log("dataDump ===");
        // console.log(dataDump);
        // console.log("dataDump END");
        return dataDump;
      }
      else {
        console.log("JSON.stringify ===");
        console.log(JSON.stringify(this.watcher, null, 2));
        console.log("JSON.stringify END");
      }
    }
    catch (e) {
      console.log("IN watchDump error === ", e);
    }
    console.log("IN watchDump(", scope, ") END");
  }
  
  setupTest(){
    // unit, functional, and/or integration test on data here
  }
  
  tap(toLog, priority = 0, scope){
    this.log(toLog, priority, scope);
    this.watch (toLog);
  }

  track(objToTrack) {
    this.trackedObjects.set(Object.keys(objToTrack)[0], {Obj:objToTrack, viewName: undefined});
    //toDo add binding code here;
  }

  trackViewer(objName, viewName) {
    let trackedObject = this.trackedObjects.get(objName);
    if (trackedObject) {
      trackedObject.value.viewName = viewName;
    } else {
      this.trackedObjects.set(objName, {Obj:undefined, viewName: viewName, viewRowManager: new _DoubleLinkedList(20)});
    }
  }
  
  scopeViewer(objName, viewName) {
    let scopeView = this.scopeViews.get(objName);
    if (scopeView) {
      scopeView.value.viewName = viewName;
    } else {
      this.scopeViews.set(objName, {Obj:undefined, viewName: viewName, viewRowManager: new _DoubleLinkedList(10), autoRefresh:true});
    }
  }

  JSs(variable) {
    console.log (JSON.stringify(variable, null, 2));
  }
  
  peek() {
    if (Array.isArray(arguments[0][Object.keys(arguments[0])[0]])) {
      console.log (Object.keys(arguments[0])[0], "[", arguments[0][Object.keys(arguments[0])[0]].length, "] ===", arguments[0][Object.keys(arguments[0])[0]]);
    }
    else if ( typeof arguments[0][Object.keys(arguments[0])[0]] === 'object' ) {
      console.log (Object.keys(arguments[0])[0], "===", JSON.stringify(arguments[0][Object.keys(arguments[0])[0]], null, 2));
    }
    else {
      console.log (Object.keys(arguments[0])[0], "===", arguments[0][Object.keys(arguments[0])[0]]);
    }
    
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
  }

  vw() {
    if (document.getElementById("movableDiv") && document.getElementById("movableDiv").style.visibility === "hidden") {
      document.getElementById("movableDiv").style.visibility = "visible";
    }

    if (!this.viewerActive) {
      this.viewerActive = true;
      // document.body.innerHTML = templateViewer;
      let docBody = document.getElementsByTagName("body")[0];
      let movableDiv = document.createElement("div");
      movableDiv.setAttribute("id", "movableDiv");
      movableDiv.innerHTML = templateViewer;
      // docBody.appendChild(movableDiv);
      docBody.insertBefore(movableDiv, docBody.firstChild);
      prepViewer ();
    
      // document.body.write( templateViewer);
      let newTabID = newTab('Console', 'addTabForm');
      nnCL.scopeViewer('Console', newTabID);
      //  openTab(event, newTabID);
  
      //  openTab causes an error ...
      // openTab(document.getElementById("addTabForm"), newTabID);   
      
      // testView.js:29 Uncaught TypeError: Cannot read property 'className' of undefined
      // at openTab (testView.js:29)
      // at nn_CL.vw (app.js:185)
      // at window.onload (testView.js:736)
  
      // BECAUSE openTab's 1st parameter is expecting an evt object & we don't know how to fake instantiate that... yet...  BenJaMin...

      // byGeo >> Possible correction?
      document.getElementById("ConsoleTab").click();
    }
  }
  vwHide() {
    document.getElementById("movableDiv").style.visibility = "hidden";
  }
  vwClose() {
    if (this.viewerActive) {
      this.viewerActive = false;

      document.getElementById('movableDiv').parentNode.removeChild(  document.getElementById('movableDiv')  );
      this.viewerTabCount = 0;
    }
  }    
}

const nnCL = new nn_CL();

// nnCL.peek Testing >>>
// let a;
// a = 13;
// nnCL.peek({a});
// a = [13, 42, 69];
// nnCL.peek({a});
// a = {a:13, b:{c:42, d:69}};
// nnCL.peek({a});
// console.log("________________");
// console.log("________________");
// console.log("________________");
// console.log("________________");


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////