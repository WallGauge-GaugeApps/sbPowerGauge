var irTransmitter =     require('./irdClass.js');
var rvrDta =            require('river-data-fetcher');
var crossSectionTbl =   require('./riverCrossSectionTable.json');
var gList =             require('./gConfig.json');
var masterList =        require('./region1Master.json');
var rpio =              require('rpio');
var solarData =         require('sunnyboy-web-box-data-fetcher');

const LedPin = 8;
rpio.open(LedPin, rpio.OUTPUT, rpio.LOW);

// Load gauge configuration into gCfg object based on gConfig.json and region1Master.json
var listArry = gList.gaugeList;
var gCfg = {};
listArry.forEach(function(value, index){
    for(let key in masterList.gaugeList){
        if(key == value){
            gCfg[key] = masterList.gaugeList[key];
        }
    }
})

var gDta = {};
var gLst = {};
var dcRptObj = {};      //Data Converstion Report Objects
var siteList ={};
var validData_DailyValues = false;
var validData_InstantValues = false;

loadApp();

var TXctrl = new irTransmitter();

function loadApp(){
    for(var x in gCfg){
        siteList[gCfg[x].dataSiteCode]=x;
    }
    gDta = new rvrDta(siteList);

    for(var x in gCfg){
        gLst[x]={
            tx: new irTransmitter(gCfg[x].gaugeIrAddress, gCfg[x].CalibrationTable),
            dSiteCode:gCfg[x].dataSiteCode,
            dataParCode:gCfg[x].dataParCode,
            dataLoc:gCfg[x].dataLoc,
            dcMethod:gCfg[x].dCMethod || ''
        }
    }

    setTimeout(function(){txGaugeValues();},5000);                          // wait 5 seconds and then send gauge values (only ran once)

    setInterval(function(){txGaugeValues();},  10 * 60 * 1000)              // every 10 minutes 
}



function txGaugeValues(){
    if(validData_DailyValues == false || validData_InstantValues == false){
        console.log('ERROR data not valid skipping gauge TX until valid data received!');
        if (!validData_DailyValues){console.log('\tDaily values not valid check network conneciton to data source!')}
        if (!validData_InstantValues){console.log('\tInstant values not valid check network conneciton to data source!')}
        rpio.write(LedPin, rpio.HIGH);
        TXctrl.cmdQueueClear();
        return;
    }

    rpio.write(LedPin, rpio.HIGH);
    setTimeout(function(){rpio.write(LedPin, rpio.LOW);}, 2000);
    TXctrl.cmdQueueClear();
    var valToSend;
    for(var gauge in gLst){
        if(gLst[gauge].dataLoc == 'instant'){
        valToSend = gDta.lookupInstantValue(gLst[gauge].dSiteCode, gLst[gauge].dataParCode)
        } else {
           valToSend = gDta.lookupDailyValue(gLst[gauge].dSiteCode, gLst[gauge].dataParCode) 
        }
        if(gLst[gauge].dcMethod != ''){
            console.log('Calling Data Conversion Method ' + gLst[gauge].dcMethod);
            switch(gLst[gauge].dcMethod){
                case 'dc_CelsiusToFahrenheit':     
                    valToSend = dc_CelsiusToFahrenheit(valToSend);
                    break; 

                case 'dc_RiverVelocity':   
                    var siteNum = gLst[gauge].dSiteCode; 
                    var flowCFS = valToSend;                            
                    var gHeight =  gDta.dtaObj.instant[siteNum].siteData['00065'].value;
                    var csTable = [];
                    csTable = crossSectionTbl[siteNum].crossSection;
                    valToSend = dc_RiverVelocityMPH(flowCFS, gHeight, csTable);
                    valToSend = (valToSend * 0.868974).toFixed(2);      //Convert statute miles to nautical miles per hour
                    var time = new Date();
                    dcRptObj[gauge]={
                        value: valToSend,
                        oTime: time,
                        name: 'Calculated Stream Velocity, Knots',
                        unit: 'Knot'
                    }  
                    console.log('Calculated Stream Velocity for ' + gauge + ' = ' + valToSend + ' knots.');
                    break; 

                default:
                    console.log('ERROR Data Conversion Method ->' + gLst[gauge].dcMethod + '<-, not found for ' + gauge + '.');
                    break;
            }
        }
        gLst[gauge].tx.sendValue(valToSend)
    }
}


