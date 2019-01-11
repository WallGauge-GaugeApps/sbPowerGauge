const sunnyBoyWebBox =  require('sunnyboy-web-box-data-fetcher');
const MyAppManager =      require('./myAppManager.js');

const myAppMan = new MyAppManager();


console.log('Sunnyboy WebBox IP Address = '+ myAppMan.webBoxIP);
var solarData =  new sunnyBoyWebBox(myAppMan.webBoxIP);

setTimeout(()  =>{getSolarData();},5000);                       // wait 5 seconds and then send gauge values (only ran once)
setInterval(() =>{getSolarData();},  5 * 60 * 1000);            // every 5 minutes 

function getSolarData(){
    solarData.updateValues(function(errNumber, errTxt, dtaObj){
        if(errNumber == 0){
            console.log('Currently generating ' + dtaObj.powerNow + " " + dtaObj.powerNowUnit);
            console.log("\tToday's total power = " + dtaObj.powerToday + " " + dtaObj.powerTodayUnit);
            console.log('\tTotal all time power generated = '+ dtaObj.powerTotal + " " + dtaObj.powerTotalUnit);
            if(myAppMan.setGaugeValue(dtaObj.powerNow)){
                myAppMan.setGaugeStatus('Okay, ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString());
            } else {
                console.log('Not allowed to send gaguge value at this time by AppManager.  Check IOS App for details');
            };
        } else {
            console.log('Error getting data from Sunnyboy WebBox');
            console.log(errTxt);
            myAppMan.setGaugeStatus('Error: ' + errTxt + ' at, ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString());
        };
    });
};

myAppMan.on('Update', ()=>{
    console.log('New update event has fired.  Reloading gauge objects...');
    console.log('The webBoxIP = ' + myAppMan.webBoxIP);

    tx = new irTransmitter(myAppMan.gaugeIrAddress, myAppMan.calibrationTable);
    solarData =  new sunnyBoyWebBox(myAppMan.webBoxIP);
    getSolarData();
});
