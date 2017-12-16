const isBrowser=new Function("try {return this===window;}catch(e){ return false;}");

if (isBrowser()) {
  document.addEventListener("DOMContentLoaded", function(event) {
    console.log("IN [configMon.js] DOMContentLoaded");
    let config = document.getElementById('dev_config');
    config['priority'] = config.getAttribute('priority');

    console.log('config >>> : ', config);
    console.log('config.priority >>> : ', config.priority);
    console.log('dev.currentPriority >>> : ', dev.currentPriority);
    dev.currentPriority = config.priority;
    //todo for the front end, need to add button & interface to set priority level and/or have a setInterval check the span attributes
  });
}
else {
  const fs = require('fs');
  const path = require('path');
  // IMPORTANT  --------  USER NEEDS TO INPUT LOCATION OF dev CONFIG FILE: 
  const configFile = path.join(__dirname, '../fileMonitoring/dev.config.json'); /**!**/
  
  function getFileCTime(path) {
    return fs.statSync(path).ctimeMs;
  }
  
  (() => {
    let lastTime; // last time changed 
    if (!lastTime) {
      lastTime = getFileCTime(configFile);
      console.log('INITIAL >>>> LAST MODIFIED: ', lastTime, '\n');
    }
  
    fs.watch(configFile, (event, filename) => {
      if (filename) {
        let newTime = getFileCTime(configFile);
        if (newTime !== lastTime) {
          console.log('lastTime --------', lastTime);
          console.log('newTime ---------', newTime);
  
          const config = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' }));
  
          // LOGIC AFTER IT DETECTS A CHANGE GOES HERE : 
          console.log('\nconfig >>>>>>>>>>>> : ', config);
          console.log('config.priority >>> : ', config.priority);
  
  
          console.log('dev.currentPriority >>> : ', dev.currentPriority);
          dev.currentPriority = config.priority;
          console.log('dev.currentPriority >>> : ', dev.currentPriority);
          
  
          // LOGIC goes above ^ 
  
          lastTime = newTime;
          // console.log('lastTime --------', lastTime);
        }
      } else {
        console.log('filename not found')
      }
    });
  })();
}
