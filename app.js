const irTransmitter =   require('irdtxclass');
const sunnyBoyWebBox =  require('sunnyboy-web-box-data-fetcher');
const Config =          require('./configManager.js');

const config = new Config();

var tx = new irTransmitter(config.gaugeIrAddress, config.calibrationTable);
var solarData =  new sunnyBoyWebBox(config.webBoxIP);

setTimeout(()  =>{getSolarData();},5000);                          // wait 5 seconds and then send gauge values (only ran once)
setInterval(() =>{getSolarData();},  5 * 60 * 1000)              // every 5 minutes 

function getSolarData(){
    solarData.updateValues(function(errNumber, errTxt, dtaObj){
        if(errNumber == 0){
            console.log('Currently generating ' + dtaObj.powerNow + " " + dtaObj.powerNowUnit);
            console.log("\tToday's total power = " + dtaObj.powerToday + " " + dtaObj.powerTodayUnit);
            console.log('\tTotal all time power generated = '+ dtaObj.powerTotal + " " + dtaObj.powerTotalUnit);
            txGaugeValues(dtaObj.powerNow);
        }
    })
}

function txGaugeValues(valueToSend){
    tx.sendValue(valueToSend)
}

config.on('Update', ()=>{
    console.log('New update event has fired.  Reloading gauge objects...');
    tx = new irTransmitter(config.gaugeIrAddress, config.calibrationTable);
    solarData =  new sunnyBoyWebBox(config.webBoxIP);
});
