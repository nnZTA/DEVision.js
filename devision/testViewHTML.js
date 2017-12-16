const templateViewer = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" type="text/css" href="../devision/style.css">
  <title>View</title>
</head>
<body>

  <div id="container">
    <div id="handle"></div>
    <div id="headerDiv">
      <div id="miniDiv"><button class="miniButton" id="miniVWClose" onclick="dev.vwClose()">X</button></div>
      <div id="miniDiv"><button class="miniButton" id="miniVWHide" onclick="dev.vwHide()">H</button></div>
      <div id="miniDiv"><button class="miniButton" id="miniButton" onclick="slideToggle()">-</button></div>
    <div id="containerheader">Click here to reposition</div>
    </div>
    
    <div id="mini">
      <div id="outterTabRibbon">
        <div id="tabRibbon" class="minimize">
          <button id="ConfigTab" class="tablinks button" onclick="createConfigForm();openTab(event, 'scopeListDiv');">Config</button> 
        </div>
      </div>


    
      <div id="page" class="minimize">
        <div id="innerPage" class="minimize">
          <div id="scopeListDiv" class="tabcontent minimize">
            <div id="pageFixedHeaderDiv"><h2 class="pageFixedHeader"> Tab Config </h2></div>
            <h3>Add Scope  <button id="addScopeNav" type="button" onclick="listScopes('addTabScope', this)">+</button></h3>               
            <div id="scopeDiv">
              <form id="addTabForm" onsubmit="newScopeTab(this)">
                <input id="textForm" class="configTabForm" type="text"  list="scopeList" autocomplete="off">
                <button type="submit">Submit</button><button onclick="hideForm(this)" type="button">x</button>
                <h6 id="addTabStatus" class="statusMessage"></h6>
              </form>
          </div>


          <h3 style="display:none">Add Track  <button id="addTrack" onclick="showForm(this)" type="button">+</button></h3>               
          <blockquote style="display:none"><strong>Note: </strong> &#x1F432; <em>In Progress...</em>&#x1F409; ... please check back soon!...</blockquote>        
          <div id="trackDiv" style="display:none">
            <form id="addTrackForm" onsubmit="newScopeTab(this)">
              <input id="trackForm" class="configTrackForm" type="text"  list="trackList" autocomplete="off">
              <button type="submit">Submit</button><button onclick="hideForm(this)" type="button">x</button>
              <h6 id="addTrackStatus" class="statusMessage"></h6>
            </form>
          </div>



            <div id="pageFixedHeaderDiv"><h2 class="pageFixedHeader"> Runtime Config </h2></div>

            <h3 id="currentPriority">  Current Priority  <button id="changePriority" onClick="changePriority(this)">+</button></h3> 
            <div id="priorityForm">
            <form id="changePriorityForm" onsubmit="return changePriority(this)">
              <input id="textFormPriority" class="runtimeConfigForm" type="text" autocomplete="off">
              <button   type="submit">Change Priority</button>
              <h6 id="statChangePriority" class="statusMessage"></h6>
            </form>
            </div>

            <h3> Current Scopes  <button id="addScopeRow" onClick="listScopes('Scopes')">+</button></h3>   
            <div id="addScopeForm">
              <form id="addRowForm" onsubmit="return addRow(this)">
                <input id="textForm" class="runtimeConfigForm" type="text" list="scopeList" autocomplete="off">
                <datalist id="scopeList"></datalist>
                <button type="submit">Add Scope</button>
                <button onclick="hideForm(this)" type="button">x</button>
                <h6 id="statusAddScope" class="statusMessage"></h6>
              </form>
            </div>            
          </div>
        </div>
      </div>
    </div>
    <div id="footerNav">
        <div>
        <button class="footerNavButton" onclick="tabPause();">Pause</button>
        <button class="footerNavButton" onclick="tabPlay();">Play</button>
        <!-- 
        <button class="footerNavButton" onclick="">Rewind</button> 
        <button class="footerNavButton" onclick="">Forward</button>
        -->
        </div>
      </div>
  </div>

</body>
</html>
<script>console.log("FROM [testViewHTML.js] templateViewer (string) LOAD COMPLETED");</script>
`;
