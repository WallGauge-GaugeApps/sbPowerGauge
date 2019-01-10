const sunnyBoyWebBox =  require('sunnyboy-web-box-data-fetcher');
const AppManager =      require('./appManager.js');

const appMan = new AppManager();

console.log('Sunnyboy WebBox IP Address = '+ appMan.webBoxIP);
var solarData =  new sunnyBoyWebBox(appMan.webBoxIP);

setTimeout(()  =>{getSolarData();},5000);                       // wait 5 seconds and then send gauge values (only ran once)
setInterval(() =>{getSolarData();},  5 * 60 * 1000);            // every 5 minutes 

function getSolarData(){
    solarData.updateValues(function(errNumber, errTxt, dtaObj){
        if(errNumber == 0){
            console.log('Currently generating ' + dtaObj.powerNow + " " + dtaObj.powerNowUnit);
            console.log("\tToday's total power = " + dtaObj.powerToday + " " + dtaObj.powerTodayUnit);
            console.log('\tTotal all time power generated = '+ dtaObj.powerTotal + " " + dtaObj.powerTotalUnit);
            if(appMan.setGaugeValue(dtaObj.powerNow)){
                appMan.setGaugeStatus('Okay, ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString());
            } else {
                console.log('Not allowed to send gaguge value at this time by AppManager.  Check IOS App for details');
            };
        } else {
            console.log('Error getting data from Sunnyboy WebBox');
            console.log(errTxt);
            appMan.setGaugeStatus('Error: ' + errTxt + ' at, ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString());
        };
    });
};

appMan.on('Update', ()=>{
    console.log('New update event has fired.  Reloading gauge objects...');
    console.log('The webBoxIP = ' + appMan.webBoxIP);

    tx = new irTransmitter(appMan.gaugeIrAddress, appMan.calibrationTable);
    solarData =  new sunnyBoyWebBox(appMan.webBoxIP);
    getSolarData();
});
