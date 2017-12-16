//  dev NinjaNineConsoleLog
'use strict';


/****************** HELPER FUNCTION ******************/


Array.prototype.arrayHasIntersection = function (compareToArr) {  
  for (let i = 0; i < compareToArr.length; i += 1) {
    for (let j = 0; j < this.length; j += 1) {
      if (compareToArr[i] === this[j]) return true;
    }
  }
  return false;
}


/*****************************************************/
/****************** DATA STRUCTURES ******************/
/******************                 ******************/

/***************** DOUBLE LINKED LIST *****************/

class DLLNode {
  constructor (data, idx) {
    this.idx = idx;
    this.data = data;
    this.ts = window.performance.now().toFixed(4);
    this.next = null;
    this.prev = null;
  }
}

class DoubleLinkedList {
  constructor(maxCountDesired = -1) {
    this.maxCountDesired = maxCountDesired;
    this.head = null;
    this.tail = null;
    this.count = 0;
  }
  
  get length() {
    return this.count;
  }
  
  addLast(data, idx = -1) {
    // Create a new Node
    const node = new DLLNode (data);
    
    if(this.count === 0) {
      // If this is the first Node, assign it to head
      node.idx = (idx === -1) ? 0 : idx;
      this.head = node;
    } else {
      // If not the first node, link it to the last node
      node.idx = (idx === -1) ? this.tail.idx + 1 : idx;
      node.prev = this.tail;
      this.tail.next = node;
    }
    
    this.tail = node;
    
    this.count += 1;
    let returnDLL;
    // console.log("this.count === ", this.count);
    // console.log("this.maxCountDesired === ", this.maxCountDesired);
    if(this.maxCountDesired > -1 && this.count > this.maxCountDesired) {
      // console.log("this.maxCountDesired exceeded by ", this.count - this.maxCountDesired)
      returnDLL = new DoubleLinkedList();
      returnDLL = this.removeFirst(this);
    }
    return returnDLL;
  }
  
  addFirst(data, idx = -1) {
    // Create a new Node
    const node = new DLLNode (data);
    
    // Save the first Node
    // const temp = this.head;
    node.next = this.head;
    
    // Point head to the new Node
    this.head = node;
    
    // Add the rest of node behind the new first Node
    // this.head.next = temp;
    
    this.count += 1;
    
    if(this.count === 1) {
      // If first node, 
      // point tail to it as well
      this.head.idx = (idx === -1) ? 0 : idx;
      this.tail = this.head;
    }
    else {
      node.next.prev = node;
      this.head.idx = (idx === -1) ? this.tail.idx + 1 : idx;
    }
    
    let returnDLL;
    // console.log("this.count === ", this.count);
    // console.log("this.maxCountDesired === ", this.maxCountDesired);
    if(this.maxCountDesired > -1 && this.count > this.maxCountDesired) {
      // console.log("this.maxCountDesired exceeded by ", this.count - this.maxCountDesired)
      returnDLL = new DoubleLinkedList();
      returnDLL.addLast = this.removeFirst(this);
    }
    return returnDLL;
  } 
  
  removeFirst() {
    let returnNode;
    if(this.count > 0) {
      returnNode = new DoubleLinkedList();
      returnNode.addLast(this.head.data, this.head.idx);
      // The head should point to the second element
      this.head = this.head.next;
      this.head.prev = null;
      
      this.count -= 1;
      
      if(this.count === 0) {
        // If list empty, set tail to null
        this.tail = null;  
      } 
    }
    return returnNode;
  }
  
  removeLast() {
    let returnNode;
    if(this.count > 0) {
      returnNode = new DoubleLinkedList();
      returnNode.addLast(this.tail.data, this.tail.idx);
      if(this.count === 1) {
        this.head = null;
        this.tail = null;
      } else {
        // Find the Node right before the last Node
        let current = this.head;
        while(current.next !== this.tail) {
          current = current.next;
        }
        
        current.next = null;
        this.tail = current;
      }
      this.count -= 1;
    }
    return returnNode;
  }
}


if (typeof window === 'undefined' && typeof process !== 'undefined') {
  // check to see if this is a node environment, since there is no DoubleLinkedList 
  module.exports = DoubleLinkedList;
}


let _DoubleLinkedList;

if (typeof window === 'undefined' && typeof process !== 'undefined') {
  // check to see if this is a node environment, since there is no DoubleLinkedList 
  _DoubleLinkedList = require('./linkedList.js');
}
else {
  _DoubleLinkedList = DoubleLinkedList;
}
///////////////////////////////////////////////////////////////////////////////

/*****************    MAP QUEUE    *****************/

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
    if (dev.viewerActive && typeof appendMapElements !== 'undefined' && dev.scopeViews.get(scope) && ( (dev.scopeViews.get(dev.viewerTabCurrent)) ? dev.scopeViews.get(dev.viewerTabCurrent).autoRefresh : true)) {
      console.log(data, Symbol.keyFor(dataSymbol), dev.scopeViews.get(scope).viewName, scope, dataQueue.symbolData.tail.idx);
      appendMapElements(data, Symbol.keyFor(dataSymbol), dev.scopeViews.get(scope).viewName, scope, dataQueue.symbolData.tail.idx);
    }
      // dev.scopeViewer
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


class devision {
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
    this.end = Symbol('5a20286cd4e5aefb503d46235a20286d237ea5e45cff8abc'); // Jac's parsing placeholder ☺ ... should be the final argument for all watch() & test() functions
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
          // console.log("IN [dev.js] >>> else if (scope) >>>", logMsg, priority, logString, scope);
          console.log("IN [dev.js] >>> else if (scope) >>>", logMsg, priority, scope);
          this.watcher.enqueue(logMsg, scope);
        }
      }
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> log appendMapElements", typeof appendMapElements); 
      let ternaryResult = ( (this.scopeViews.get(this.viewerTabCurrent)) ? this.scopeViews.get(this.viewerTabCurrent).autoRefresh : true); 
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ternary result", ternaryResult);  
      if (this.viewerActive && typeof appendMapElements !== 'undefined' && ( (this.scopeViews.get(this.viewerTabCurrent)) ? this.scopeViews.get(this.viewerTabCurrent).autoRefresh : true))
        appendMapElements(dev.consoleData.tail.data, dev.consoleData.tail.ts, 'Tab0', 'Console', dev.consoleData.tail.idx);
    }
  }

  passThru (logMsg, priority = 0, scope) {
    log(logMsg, priority = 0, scope);
    return logMsg
  }
  
  watch (item) {
    let copy = JSON.parse( JSON.stringify( item ) );
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
      dev.scopeViewer('Console', newTabID);
      //  openTab(event, newTabID);
  
      //  openTab causes an error ...
      // openTab(document.getElementById("addTabForm"), newTabID);   
      
      // testView.js:29 Uncaught TypeError: Cannot read property 'className' of undefined
      // at openTab (testView.js:29)
      // at devision.vw (app.js:185)
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

const dev = new devision();

// dev.peek Testing >>>
// let a;
// a = 13;
// dev.peek({a});
// a = [13, 42, 69];
// dev.peek({a});
// a = {a:13, b:{c:42, d:69}};
// dev.peek({a});
// console.log("________________");
// console.log("________________");
// console.log("________________");
// console.log("________________");


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////