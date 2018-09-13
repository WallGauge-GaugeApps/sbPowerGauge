var irTransmitter =     require('irdTxClass');
var gauge =             require('./gaugeConfig.json');
var rpio =              require('rpio');
var sunnyBoyWebBox =    require('sunnyboy-web-box-data-fetcher');

const LedPin = 8;
rpio.open(LedPin, rpio.OUTPUT, rpio.LOW);

// Load gauge configuration into gCfg object based on gConfig.json and region1Master.json

var gLst = {};
var validData = false;


var tx = new irTransmitter(gauge.gaugeIrAddress, gauge.CalibrationTable);
var solarData =  new sunnyBoyWebBox(gauge.webBoxIP);

setTimeout(function(){getSolarData();},5000);                          // wait 5 seconds and then send gauge values (only ran once)

setInterval(function(){getSolarData();},  5 * 60 * 1000)              // every 5 minutes 


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
    rpio.write(LedPin, rpio.HIGH);
    setTimeout(function(){rpio.write(LedPin, rpio.LOW);}, 2000);


    tx.cmdQueueClear();
    tx.sendValue(valueToSend)
}


