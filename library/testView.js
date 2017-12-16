'use strict';
console.log("*****************************TESTVIEW JS ************************TESTVIEW JS *******TESTVIEW JS ***************************");

let active; //to be used on openTab(evt, tab) and on context of verticalScroll(x, y, blnMouseHeld)
// let a = 1; //temporary to name newly created tabs;
let formDiv = false;

/**********START OF LOGIC IN CREATING, TABS, TABLES and CHANGING dev Data ******************/

//invoked when adding a Scope or Track from Config Tab
function openTab(evt, tab) { 
  // dev.peek({evt});
  // console.log("evt.currentTarget.id === ", evt.currentTarget.id.replace("Tab", ""));
  console.log("IN [testView.js] >>> function openTab(evt, tab)");
  dev.viewerTabCurrent = evt.currentTarget.id.replace("Tab", "");
  console.log("evt.currentTarget.class === ", typeof evt.currentTarget);
  console.log("evt.currentTarget.class === ", evt.currentTarget.className);
  dev.viewerTabCurrentType = (evt.currentTarget.className.indexOf('addTabFormClass') > -1) ? 'scope' : 'tracked';

  // Declare all letiables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // console.log("this is the tab to be highlighted!=====> ", tab);
  // console.log("this is the tab to be highlighted!=====> ", tab);
  // console.log("this is the tab to be highlighted!=====> ", tab);
  // console.log("this is the tab to be highlighted!=====> ", tab);
  // console.log("this is the tab to be highlighted!=====> ", tab);
  // console.log("this is the tab to be highlighted!=====> ", tab);
  // console.log("this is the tab to be highlighted!=====> ", tab);

  // console.log("this is the evt.currentTarget to be highlighted!=====> ", evt.currentTarget);
  // console.log("this is the type of className to be highlighted!=====> ",typeof evt.currentTarget.className);
  // console.log("this is the className to be highlighted!=====> ", evt.currentTarget.className);

  // Show the current tab, and add an "active" class to the button that opened the tab
  active = document.getElementById(tab);
  active.style.display = "block";
  evt.currentTarget.className += " active";

  if (tab !== "scopeListDiv") {
    document.getElementById("addTabForm").elements[0].value = "";
    document.getElementById("changePriorityForm").elements[0].value = "";
    document.getElementById("addRowForm").elements[0].value = "";
    document.getElementById("addTrackForm").elements[0].value = "";
  } 
  
  //console.log('in index.js ---- openTab() invoked');
}

function tabPause() {
  console.log(dev.viewerTabCurrentType , dev.viewerTabCurrent);
  if (dev.scopeViews.get(dev.viewerTabCurrent)) {
    if (dev.viewerTabCurrentType === 'scope') {
      dev.scopeViews.get(dev.viewerTabCurrent).autoRefresh = false;
    }
    else {
      //tracked item
      dev.trackedObjects.get(dev.viewerTabCurrent).autoRefresh = false;
    }
  }
}

function tabPlay() {
  if (dev.scopeViews.get(dev.viewerTabCurrent)) {    
    if (dev.viewerTabCurrentType === 'scope') {
      dev.scopeViews.get(dev.viewerTabCurrent).autoRefresh = true;



      if (document.getElementById(dev.viewerTabCurrent + 'Tab')) {
        if (dev.viewerTabCurrent === "Console") {
          for (let node = dev.consoleData.head; node; node = node.next) {                        // vwData.forEach( (value, key, map, scope) => {
            appendMapElements(node.data, node.ts, 'Tab1', 'Console', node.idx);
          };
        }
        else {
          let watchDump = dev.watchDump(dev.viewerTabCurrent);
          console.log(" tabPlay >>> dev.watchDump('", dev.viewerTabCurrent, "') ===");
          console.log(watchDump);



          // todo todo todo ...  I don't understand why I don't need the following...

          // if (document.getElementById(dev.viewerTabCurrent+'tbody')) {
          //   document.getElementById(dev.viewerTabCurrent+'tbody').parentNode.removeChild(  document.getElementById(dev.viewerTabCurrent+'tbody')  );
          // }
          
          // ... except that there's magic in the world?  (... or it's BenJaMin's fault ...)


    
          // dev.scopeViewer(dev.viewerTabCurrent, dev.viewerTabCurrent + 'Tab');
          // console.log("dev.scopeViews => ", dev.scopeViews); 
    
          // console.log("newTabID === ", newTabID);
          watchDump.forEach( function (value, key, map) {
            appendMapElements(value.logData, key, dev.viewerTabCurrent + 'Tab', dev.viewerTabCurrent, value.scopeIDX);
          });  
        }
      }  
    }
    else {
      //tracked item
      dev.trackedObjects.get(dev.viewerTabCurrent).autoRefresh = true;
    }
  }
} 

// Function triggered by "+" beside Add Track in Config Tab to show form's input
function showForm(e) {
  document.getElementById("addTrackForm").style.visibility = "visible";
  document.getElementById("addTrack").style.display = "none";

  listTrackedObjs('addTrackedObj', e);
  // console.log('Hit showForm')
}

//Generic Function that hides the form in the element that invoked this function
function hideForm(e) { //e === "this"
  // console.log('fired hideScopeDiv(e)=======e.parentNode===========>', e.parentNode.parentNode.style.visibility);
  e.parentNode.style.visibility = "hidden";
  e.parentNode.elements[0].value = "";
  if (e.parentNode.id === "addTabForm") {
    document.getElementById("addScopeNav").style.display = "inline-block";  
    document.getElementById("addTabStatus").innerText = "";  
  }
  if (e.parentNode.id === "addRowForm") {
    document.getElementById("addScopeRow").style.display = "inline-block"; 
    document.getElementById("statusAddScope").innerText = '';
  }
  if (e.parentNode.id === "addTrackForm") {//addTrackForm
    document.getElementById("addTrack").style.display = "inline-block"; 
    document.getElementById("addTrackStatus").innerText = ""; 
  }
}

function listTrackedObjs(origin, e) {
  console.log("in listTrackedObjs======>", origin);
  event.preventDefault();

  let textForm = document.getElementById("trackForm");
  if (textForm.firstChild) textForm.removeChild(textForm.firstChild);
  let dataList = document.createElement("datalist");
  dataList.setAttribute("id", "trackedObjList");
  textForm.appendChild(dataList);

  if (origin === 'addTrackedObj') {
    // console.log('fired showScopes(addTabScope)==================>');  
    document.getElementById("addTrackForm").style.visibility = "visible";
    document.getElementById("addTrack").style.display = "none";    
    
  }

  let trackedObjsName = dev.trackedObjects.keys();
  let trackedObjsArray = []; 

  for(let i = 0; i < dev.trackedObjects.size; i += 1) {
    let trackedObjName = trackedObjsName.next();
    // console.log("this is each of the dev.watcher._catalog.keys();", trackedObjName);
    if (trackedObjsArray.indexOf(trackedObjName) === -1) {
      trackedObjsArray.push(trackedObjName);
      // console.log('this is the #id trackedObjList', document.getElementById("trackedObjList"));
      let frag = document.createDocumentFragment();
      let select = document.createElement("option");
      select.value = trackedObjName;
      select.text = trackedObjName;
      frag.appendChild(select);
      dataList.appendChild(frag);
    }
  }

  return trackedObjsArray;
}

//listScopes builds all the datalist options for forms with id addTabForm and addRowForm;
//data being inputed is from dev.watcher.catalog and dev.currentScope
function listScopes(origin, e) {
  event.preventDefault();

  let textForm = document.getElementById("textForm");
  if (textForm.firstChild) textForm.removeChild(textForm.firstChild);
  let dataList = document.createElement("datalist");
  dataList.setAttribute("id", "scopeList");
  textForm.appendChild(dataList);

  let scopesSymbol = dev.watcher._catalog.keys();
  let scopesArray = []; 

  for(let i = 0; i < dev.watcher._catalog.size; i += 1) {
    let scopeName = Symbol.keyFor(scopesSymbol.next().value);
    // console.log("this is each of the dev.watcher._catalog.keys();", scopeName);
    if (scopesArray.indexOf(scopeName) === -1) {
      scopesArray.push(scopeName);
      // console.log('this is the #id scopeList', document.getElementById("scopeList"));
      let frag = document.createDocumentFragment();
      let select = document.createElement("option");
      select.value = scopeName;
      select.text = scopeName;
      frag.appendChild(select);
      dataList.appendChild(frag);
    }
  }
  // console.log('listScopes was triggered========THIS IS DATALIST===========>', dataList);
  // console.log('listScopes was triggered========THIS IS DATALIST.OPTIONS===========>', dataList.options);
  
  //Add another loop to add currentScopes
  for (let k = 0; k < dev.currentScope.length; k++) {
    let scopeName = dev.currentScope[k];

    if (scopesArray.indexOf(scopeName) === -1) {
      scopesArray.push(scopeName);
      // console.log('this is the #id scopeList', document.getElementById("scopeList"));
      let frag = document.createDocumentFragment();
      let select = document.createElement("option");
      select.value = scopeName;
      select.text = scopeName;
      frag.appendChild(select);
      dataList.appendChild(frag);
    }
  }
  if (origin === 'addTabScope') {
    // console.log('fired showScopes(addTabScope)==================>');  
    document.getElementById("addTabForm").style.visibility = "visible";
    document.getElementById("addScopeNav").style.display = "none";    
    
  }
  if (origin === 'Scopes') {
    document.getElementById("addRowForm").style.visibility = "visible";  
    document.getElementById("addScopeRow").style.display = "none";    
  }
  // console.log("LISTSCOPES WAS HIT===============>")
  return scopesArray;
}

//Removes and addTablebuilds the Current Scopes Table found in Config Tab under Runtime Config.
//Helper functions used are the ff: addScopeTable() appendScopeElements().
function createConfigForm() {
  document.getElementById("currentPriority").innerText = ` Current Priority: ${dev.currentPriority}`;
  
  // console.log('========>', dev.currentScope);
  // console.log('=========BEFORE==============>', dev.currentScope);
  if (document.getElementById('scopeListTable')) {
    while (document.getElementById('scopeTableBody').firstChild) {
      document.getElementById('scopeTableBody').removeChild(document.getElementById('scopeTableBody').firstChild);
    }
  }
    // console.log('=========AFTER==============>', dev.currentScope);
  dev.currentScope.forEach(appendScopeElements);
  // console.log('========>', dev.currentScope);
}


//Changes value of dev.currentPriority directly. Triggered in form id="changePriorityForm"
function changePriority(e) {
  event.preventDefault();
  let priority = document.getElementById("textFormPriority").value;
  document.getElementById("statChangePriority").innerText = ""

  if (!isNaN(priority)) { //inputted data is a number

    // console.log('this is the dev.currentPriority BEFORE=========>', dev.currentPriority);    
    dev.currentPriority = Number(priority);
    document.getElementById("currentPriority").innerText = ` Current Priority: ${dev.currentPriority}`;
  } else {
    document.getElementById("statChangePriority").innerText = "***Please enter a number"
  }

  document.getElementById("textFormPriority").value = "";
}



//Creates a new tab with help of helper function, newTab() to create a new tab to be 
//appended on div id="tabRibbon". It identifies which form input it came from,  
//to create a tab for Scope or tab for Track
function newScopeTab(e) {
  // console.log('FIRING newScopeTab=======================>');
  // console.log(document.getElementById("textForm").value);
  // console.log("_______________________________ TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  // let showScope = document.getElementById("textForm").value;

  event.preventDefault();
  event.stopPropagation();
  // console.log("this is the id of THIS", e.id);
  let newTabID;
  let showScope = e.elements[0].value;
  let madeFrom = e.id;

  if (madeFrom === "addTabForm") {
    document.getElementById("addTabStatus").innerText = "";
    document.getElementById("textForm").value = "";
    if (showScope.trim().length === 0) {
      return;
    }
    
    let scopeListArray = listScopes();
    console.log("scopeListArray[", scopeListArray.length, "] => ", scopeListArray); 
    
    // document.getElementById("addTabStatus").innerText = "";
    // if (!document.getElementById(showScope + 'Tab')) {
    //   openTab(event, newTabID);
    //   return;
    // } else {
    //   document.getElementById("addTrackStatus").innerText = `***Tab '${showScope}' already exists.`;
    //   return;
    // }
    
    if (scopeListArray.indexOf(showScope) === -1) {
      console.log("IN [testView.js] newScopeTab >>> if (scopeListArray.indexOf(showScope) === -1)");
      // console.log("######################## newScopeTab >>> if (scopeListArray.indexOf(showScope) === -1)");
      document.getElementById('addTabStatus').innerText = "";
      if (!document.getElementById(showScope + 'Tab')) {
        newTabID = newTab(showScope, madeFrom);
        dev.scopeViewer(showScope, newTabID);
        console.log("dev.scopeViews => ", dev.scopeViews); 
        // openTab(event, newTabID);
        document.getElementById(showScope + "Tab").click();
        return;
      } else {
        document.getElementById("addTabStatus").innerText = `***Tab '${showScope}' already exists.`;
        return;
      }
    }
    
    // console.log("FALSE FALSE FALSE FALSE FALSE newScopeTab >>> if (scopeListArray.indexOf(showScope) === -1)");
    
    if (document.getElementById(showScope + 'Tab')) {
      document.getElementById("addTabStatus").innerText = `***Tab '${showScope}' already exists.`;
    }
    
    let watchDump = dev.watchDump(showScope);
    console.log(" >>> dev.watchDump('", showScope, "') ===");
    console.log(watchDump);
    if (!document.getElementById(showScope+'table')) {
      newTabID = newTab(showScope, madeFrom);
      dev.scopeViewer(showScope, newTabID);
      console.log("dev.scopeViews => ", dev.scopeViews); 
    // console.log("newTabID === ", newTabID);
      let rowCount = 0;
      if (watchDump) {
        watchDump.forEach( function (value, key, map) {
          appendMapElements(value.logData, key, newTabID, showScope, value.scopeIDX);
        });  
      } 
      else {
        appendMapElements('No data found. Error Code 42. ', window.performance.now().toFixed(4), newTabID, showScope,  '<span style="font-size:25px;"> &#x1F409;</span>');  // &#x1F409; === dragon emoji      
      }
      // openTab(event, newTabID);
      // console.log("POST openTab RETURNED TO newScopeTab >>> >>> >>> >>> newTabID === ", newTabID);
      document.getElementById(showScope + "Tab").click();
      // console.log("COMPLETED  document.getElementById(showScope + 'Tab').click(); ", document.getElementById(showScope + "Tab"));
    } 
  }


  else if (e.id ==="addTrackForm") {
    let trackedObjsListArray = listTrackedObjs();
    
    if (trackedObjsListArray.indexOf(showScope) === -1) {
      document.getElementById("addTabStatus").innerText = "";
      if (!document.getElementById(showScope + 'Tab')) {
        newTabID = newTab(showScope, madeFrom);
        dev.trackViewer(showScope, newTabID);
        console.log("dev.trackedObjects => ", dev.trackedObjects);      
        // openTab(event, newTabID);
        document.getElementById(showScope + "Tab").click();
        return;
      }
      else {
        document.getElementById("addTrackStatus").innerText = `***Tab '${showScope}' already exists.`;
        return;
      }
    }
  }
}


//helper function of newScopeTab() creating a new tab for div id="tabRibbon"
function newTab(scope, madeFrom) {
  let className;

  //  todo need to refactor 'addTabForm' to 'addScopeForm'
  console.log("########  [testView.js] function newTab(scope, madeFrom) >>>", madeFrom);
  if (madeFrom === "addTabForm") {
    className = madeFrom + "Class";
  }
  if (madeFrom === "addTrackForm") {
    className = madeFrom + "Class";
  }

  let button = document.createElement("div");      
  let buttonNode = document.createTextNode(  (scope) ? scope : `Tab${dev.viewerTabCount}` );

  button.appendChild(buttonNode);
  button.setAttribute("id", (scope) ? scope + 'Tab' : `Tab${dev.viewerTabCount}`);
  button.classList.add("tablinks");
  button.className += ` button ${className}`;  
  button.setAttribute("onclick",`openTab(event, 'Tab${dev.viewerTabCount}')`);

  if (scope !== 'Console') {
    let closeButton = document.createElement("BUTTON");
    closeButton.setAttribute("id", `navTab${dev.viewerTabCount}`);
    closeButton.classList.add("closeNavButton");
    closeButton.setAttribute("onclick", `closeNavTab(this, 'navTab${dev.viewerTabCount}', 'Tab${dev.viewerTabCount}')`);
    closeButton.innerHTML = 'x';

    button.appendChild(closeButton);
  }
  document.getElementById("tabRibbon").appendChild(button);

  let newHeader = document.createElement('h3');
  let innerText = document.createTextNode((scope) ? scope + ` (Tab${dev.viewerTabCount})` : `Tab${dev.viewerTabCount}`);
  newHeader.appendChild(innerText);

  let newDiv = document.createElement('div');
  newDiv.id = `Tab${dev.viewerTabCount}`;
  newDiv.className = 'tabcontent';
  newDiv.appendChild(newHeader);

  document.getElementById("innerPage").appendChild(newDiv);

  dev.viewerTabCount += 1;
  //console.log('in index.js ---- newTab() invoked');
  if (madeFrom === "addTrackForm") {
    console.log("########  [testView.js] appendMapElementsappendMapElementsappendMapElements >>>");
    // appendMapElements('Not Implemented Yet... Error Code 42. ', window.performance.now().toFixed(4), newTabID, showScope,  '<span style="font-size:25px;"> &#x1F409;</span>');  // &#x1F409; === dragon emoji      
    appendMapElements('<strong><em>Not Implemented Yet...</em> Error Code 42.</strong>', window.performance.now().toFixed(4), newDiv.id, scope,  '<span style="font-size:25px;">&#x1F409;</span>');  // &#x1F409; === dragon emoji      
  }
  
  return newDiv.id;
}

//Generic function triggered by the "x" buttons on tabs on div id="tabRibbon"
function closeNavTab(e, id, tabPageId) {
  event.stopPropagation();
  document.getElementById(id).parentNode.parentNode.removeChild(document.getElementById(id).parentNode);
  document.getElementById(tabPageId).parentNode.removeChild(document.getElementById(tabPageId));
  // console.log('this is the PARENT=========>', document.getElementById(id));
  let currentName = e.parentNode.id.replace('Tab', '');
  console.log("currentName === ", currentName);
  if (e.parentNode.classList.contains('addTrackFormClass'))
  {
    console.log("dev.trackedObjects => ", dev.trackedObjects);
    let trackedObject = dev.trackedObjects.get(currentName);
    console.log("trackedObject === ", trackedObject);
    if (trackedObject.Obj) {
      trackedObject.viewName = undefined;
    } 
    else {
      dev.trackedObjects.delete(currentName);
    }
    console.log("dev.trackedObjects => ", dev.trackedObjects);
  }
  else { 
    console.log("dev.scopeViews => ", dev.scopeViews);
    let scopeView = dev.scopeViews.get(currentName);
    console.log("scopeView === ", scopeView);
    if (scopeView.Obj) {
      scopeView.viewName = undefined;
    } 
    else {
      dev.scopeViews.delete(currentName);
    }
    console.log("dev.scopeViews => ", dev.scopeViews);
  }

  // console.log("this is the name of tracked object", e.parentNode.id.replace('Tab', ''));  
  // console.log("e.parentNode.id.class === ", typeof e.parentNode.classList );  //  ==>  DOMTokenList
  // console.log("e.parentNode.id.class === ", Array.isArray( e.parentNode.classList ) );
  // console.log("e.parentNode.id.class === ", e.parentNode.classList );
  // console.log("e.parentNode.id.class === ", e.parentNode.classList.contains('addTrackFormClass') );
  
}

//deletes row on table #scopeListTable on Config Tab under 
//Current Scopes and splices out data from dev.currentScope
function removeRow(scope) { 
  dev.currentScope.splice(dev.currentScope.indexOf(scope), 1);
  createConfigForm(); //if table exists, deletes it, then builds it again
  listScopes();
}

//triggered by form id="addRowForm" that adds a row with the inputted string. 
//Filters duplicates and pushes it in dev.currentScope
function addRow(e) { // "e" === this
  event.preventDefault();
  const scope = e.elements[0].value;
  document.getElementById("statusAddScope").innerText = "";
  // console.log('========THIS IS THE SCOPES PARENT========>', scope);

  if (scope === '') return;
  if (dev.currentScope.indexOf(scope) > -1) {
    document.getElementById("statusAddScope").innerText = "Entered scope already exists***"
    return;
  }

  dev.currentScope.push(scope);
  listScopes();
  createConfigForm(); //if table exists, deletes it, then builds it again
  e.elements[0].value = "";
  // console.log('scope and e.elements[0].value', scope, e.elements[0].value)

}



//Helper function of createConfigForm() that creates table headers
function addScopeTable(parentElement) {
  // console.log('parent element, ===========>', parentElement);

  let table = document.createElement('table');
  table.setAttribute("id", 'scopeListTable');

  document.getElementById(parentElement).appendChild(table);

  let header = table.createTHead();
  let row = header.insertRow(0);     
  let headerCell1 = document.createElement("TH");
  let headerCell2 = document.createElement("TH");
  headerCell1.innerHTML = 'Current Scopes';
  row.appendChild(headerCell1);

  let tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'scopeTableBody');
  table.appendChild(tbody)
  
}

//if table id="scopeListTable" doesn't exists, invokes addScopeTable() to create table;
//Helper function of createConfigForm() that creates rows to 
//be appended to table id="scopeListTable"
function appendScopeElements(cell) {
  // console.log("IN appendScopeTable >>> scope === ", 'scopeElements');
  let parentElement = "scopeListDiv";

  if (!document.getElementById("scopeListTable")) {
      addScopeTable(parentElement);
  } 

  let table = document.getElementById('scopeTableBody');
  let row = table.insertRow(table.rows.length);
  let rowNum = table.rows.length;
  let cell1 = row.insertCell(0); 
  row.setAttribute("id", 'row' + rowNum);

  let closeRowButton = document.createElement("button");
  let text = document.createTextNode("x");
  
  closeRowButton.setAttribute("class", "closeRowButton");
  closeRowButton.setAttribute("onclick", `removeRow('${cell}')`);
  closeRowButton.appendChild(text);

  // console.log('this is cell=================>',   cell);

  cell1.innerHTML = cell;
  cell1.appendChild(closeRowButton);

}

//used to create table for data for scopes appended to div id="tabRibbon";
function addTable(parentElement, scope = '') {
  
  console.log('parent element, ===========>',parentElement);

  let table = document.createElement('table');
  table.setAttribute("id", scope+'table');

  document.getElementById(parentElement).appendChild(table);

  let header = table.createTHead();
  let row = header.insertRow(0);     
  let headerCell0 = document.createElement("TH");
  let headerCell1 = document.createElement("TH");
  let headerCell2 = document.createElement("TH");
  headerCell0.setAttribute('class', 'TimeStamp');
  headerCell0.innerHTML = 'TimeStamp';
  headerCell1.setAttribute('class', 'RowCount');
  headerCell1.innerHTML = '#';  //  #  ===  &#35;
  headerCell2.setAttribute('class', 'LogData');
  headerCell2.innerHTML = 'Log';
  row.appendChild(headerCell0);
  row.appendChild(headerCell1);
  row.appendChild(headerCell2);

  let tbody = document.createElement('tbody');
  tbody.setAttribute('id', scope+'tbody');
  table.appendChild(tbody)
  
}

//used to append data to table for data for scopes appended to div id="tabRibbon";
function appendMapElements(value, key, parentElement, scope = '', rowCount) {

  console.log("IN appendMapElements >>> scope === ", scope); 

  // let poppedRow = dev.scopeViews.get(scope).viewRowManager.addLast(rowCount);
  // if (poppedRow) {
  //   for (let node = poppedRow.head; node; node = node.next) {
  //     console.log("poppedRow >>>> 'viewDR_'+scope+node.idx === ", 'viewDR_'+scope+node.idx);
  //     //poppedRow >>>> 'viewDR_'+scope+node.idx ===  viewDR_Console340
  //     if (document.getElementById('viewDR_'+scope+node.idx))
  //       document.getElementById('viewDR_'+scope+node.idx).parentNode.removeChild(  document.getElementById('viewDR_'+scope+node.idx)  );
  //   };
  // }

  let scopeView = dev.scopeViews.get(scope);
  if (scopeView) {
    let poppedRow = scopeView.viewRowManager.addLast(rowCount);
    if (poppedRow) {
      for (let node = poppedRow.head; node; node = node.next) {
        // console.log("poppedRow >>>> 'viewDR_'+scope+node.idx === ", 'viewDR_'+scope+node.idx);
        //   example output  ==>>  poppedRow >>>> 'viewDR_'+scope+node.idx ===  viewDR_Console340
        if (document.getElementById('viewDR_'+scope+node.idx))
          document.getElementById('viewDR_'+scope+node.idx).parentNode.removeChild(  document.getElementById('viewDR_'+scope+node.idx)  );
      };
    }
  }

  
  if (!document.getElementById(scope+'table')) {
      addTable(parentElement, scope);
  } 

  let table = document.getElementById(scope+'tbody');
  let row = table.insertRow(table.rows.length);
  // row.setAttribute('id', 'viewDR_'+scope+rowCount);
  // row.setAttribute('id', 'viewDR_' + scope + dev.scopeViews.get(scope).viewRowManager.tail.idx);
  row.setAttribute('id', 'viewDR_' + scope + (  (scopeView) ? dev.scopeViews.get(scope).viewRowManager.tail.idx : 42  )  );
  let cell0 = row.insertCell(0);
  let cell1 = row.insertCell(1);
  let cell2 = row.insertCell(2);
  cell0.setAttribute('class', 'TimeStamp');
  cell0.innerHTML = key;
  cell1.setAttribute('class', 'RowCount');
  cell1.innerHTML = rowCount;
  cell2.setAttribute('class', 'LogData');
  cell2.innerHTML = value;
}





/***END*****END******END OF LOGIC IN CREATING, TABS, TABLES and CHANGING dev Data ************END********END**************/


/****************** START OF LOGIC FOR MINIMIZING AND EXPANDING WINDOW*******************/
let open = true;
let heightChecked = false;
let initHeight = 0;
let initWidth = 0;
let intval = null;
let widthVal = null;
// let initWidth = 0;

function slideToggle() {

  window.clearInterval(intval);
  let mdiv = document.getElementById("mini");
  // let mdiv = document.getElementById("container");
  //console.log(wDiv);

  if(!heightChecked) {
    initHeight = (mdiv.offsetHeight < 200) ? 200 : mdiv.offsetHeight;
    initWidth = (mdiv.offsetLeft < 400) ? 400 : mdiv.offsetLeft;
    heightChecked = true;
  }

  if(open) {

    document.getElementById('miniButton').innerHTML = '&#43'; //plus
    let h = mdiv.offsetHeight;
    open = false;

    intval = setInterval(function(){
      h--;
      mdiv.style.height = h + 'px';
      if(h <= 0)
        window.clearInterval(intval);
    }, 1);
    //console.log('closing.....')
  }
  else {

    document.getElementById('miniButton').innerHTML = '&#45' //minus
    let h = mdiv.offsetHeight;
    let w = mdiv.offsetWidth;
    open = true;
    intval = setInterval(function(){
      if(h < initHeight) {
        h++;
        mdiv.style.height = h + 'px';
      }
      if(w < initWidth) {
        w++;
        mdiv.style.width = w + 'px';
      }
      if (h >= initHeight && w >= initWidth)
        window.clearInterval(intval);
}, 1); 

    //console.log('opening.....')
  }

  //console.log('slideToggle')
}

/****************** END OF LOGIC FOR MINIMIZING AND EXPANDING WINDOW*******************/



function prepViewer () {
  console.log('IN [testView.js] prepViewer()');


 /****************************** START OF LOGIC FOR DRAGGING WHOLE DIV ******************************/
  // console.log('HELLOWORLD======>');

  //Make the DIV element draggable
  dragElement(document.getElementById("container"));

  function dragElement(elmnt) {
    elmnt.style.position = "absolute";
    //console.log('hit dragElement');
    
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (document.getElementById(elmnt.id + "header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // set the element's new position:

      // the following works to limit the top left boundary...
      //    ... however, since we also have to check the lower right 
      //        we can't use ternary operators (without ludacris mode that is)
      // elmnt.style.top = (((elmnt.offsetTop - pos2) < 0) ? 0 : (elmnt.offsetTop - pos2)) + "px";
      // elmnt.style.left = (((elmnt.offsetLeft - pos1) < 0) ? 0 : (elmnt.offsetLeft - pos1)) + "px";
      
      // //console.log("heights:");
      // //console.log(elmnt.parentElement);
      // //console.log(elmnt.parentNode);
      // //console.log(elmnt.offsetHeight);
      // //console.log(window.outerHeight);

      let manualHeightOffsetFix = 74;

      if (elmnt.offsetTop - pos2 < 0) {
        //console.log("v-top:");
        elmnt.style.top = 0 + "px";
      } else if (elmnt.offsetTop - pos2 + elmnt.offsetHeight + manualHeightOffsetFix > window.outerHeight) {
        //console.log("v-bottom:");
        elmnt.style.top = window.outerHeight - elmnt.offsetHeight - manualHeightOffsetFix + "px";
      } else {
        //console.log("v-good:");
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      }
      // elmnt.style.top = ((( < 0) ? 0 : (elmnt.offsetTop - pos2)) + "px";
      // elmnt.style.left = (((elmnt.offsetLeft - pos1) < 0) ? 0 : (elmnt.offsetLeft - pos1)) + "px";

      if (elmnt.offsetLeft - pos1 < 0) {
        //console.log("v-top:");
        elmnt.style.left = 0 + "px";
      } else if (elmnt.offsetLeft - pos1 + elmnt.offsetWidth > window.outerWidth) {
        //console.log("v-bottom:");
        elmnt.style.left = window.outerWidth - elmnt.offsetWidth + "px";
      } else {
        //console.log("v-good:");
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      }
      
      //console.log('this is Y coordinate after drag and drop', elmnt.style.top);
      //console.log('this is X coordinate after drag and drop', elmnt.style.left);
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
      elmnt.style.position = "fixed";
      document.getElementById("page").style.opacity = 1;
      clearSelection();
    }
    document.getElementById("container").style.position = "fixed";
  }

  //console.log('in index.js ---- dragElement() invoked');

 /******************************END FOR LOGIC FOR DRAGGING WHOLE DIV ******************************/





 /******************************LOGIC FOR MANUAL RESIZING BY DRAGGING*************************/

 function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
  }
 let resizeHandle = document.getElementById('handle');
 let boxes = [document.getElementById('mini'), document.getElementById("tabRibbon"), document.getElementById("page"), document.getElementById("innerPage")];

 resizeHandle.addEventListener('mousedown', initialiseResize, false);
 
 function initialiseResize(e) {
   window.addEventListener('mousemove', startResizing, false);
   window.addEventListener('mouseup', stopResizing, false);
 }
 
 function startResizing(e) {
   boxes.forEach(box => {
     if (box === document.getElementById("tabRibbon")) {
      box.style.width = (e.clientX - box.offsetLeft) + 'px';
     } else {
       box.style.width = (e.clientX - box.offsetLeft) + 'px';
       box.style.height = (e.clientY - box.offsetTop) + 'px';

     }
   })
 }
 function stopResizing(e) {
    window.removeEventListener('mousemove', startResizing, false);
    window.removeEventListener('mouseup', stopResizing, false);
    clearSelection();
 }
 /******************************END FOR MANUAL RESIZING BY DRAGGING*************************/

 console.log("all this shite should run now...");
//  dev.vw();

}


