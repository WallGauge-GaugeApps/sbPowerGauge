const sunnyBoyWebBox =  require('sunnyboy-web-box-data-fetcher');
const MyAppMan =        require('./MyAppManager.js');

const myAppMan = new MyAppMan(__dirname + '/gaugeConfig.json', __dirname + '/modifiedConfig.json');
var inAlert = false;

const getDataInterveral = 5;   // Time in minutes

console.log('__________________ App Config follows __________________');
console.dir(myAppMan.config, {depth: null});
console.log('________________________________________________________');

var solarData =  new sunnyBoyWebBox(myAppMan.config.webBoxIP);



function getSolarData(){
    solarData.updateValues(function(errNumber, errTxt, dtaObj){
        if(errNumber == 0){
            console.log('Currently generating ' + dtaObj.powerNow + " " + dtaObj.powerNowUnit);
            //console.log("\tToday's total power = " + dtaObj.powerToday + " " + dtaObj.powerTodayUnit);
            //console.log('\tTotal all time power generated = '+ dtaObj.powerTotal + " " + dtaObj.powerTotalUnit);
            if(myAppMan.setGaugeValue(dtaObj.powerNow)){
                myAppMan.setGaugeStatus('Okay, ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString());
                if(inAlert == true){
                    myAppMan.sendAlert({[myAppMan.config.descripition]:"0"});
                    inAlert = false;
                };
            } else {
                console.log('Not allowed to send gaguge value at this time by AppManager.  Check IOS App for details');
            };
        } else {
            console.log('Error getting data from Sunnyboy WebBox');
            console.log(errTxt);
            myAppMan.setGaugeStatus('Error getting data from SunnyBoy Webbox at ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString()  + ' -> '+ errTxt);
            if(inAlert == false){
                myAppMan.sendAlert({[myAppMan.config.descripition]:"1"});
                inAlert = true;
            };
        };
    });
};

myAppMan.on('Update', ()=>{
    console.log('New update event has fired.  Reloading gauge objects...');
    myAppMan.setGaugeStatus('Config updated received. Please wait, may take up to 5 minutes to reload gauge objects. ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString());
    console.log('The webBoxIP = ' + myAppMan.config.webBoxIP);
    solarData =  new sunnyBoyWebBox(myAppMan.config.webBoxIP);
    getSolarData();
});


/*
setTimeout(()  =>{getSolarData();}, 5000);                     // wait 5 seconds and then send gauge values (only ran once)
setInterval(() =>{getSolarData();}, 5 * 60 * 1000);            // every 5 minutes 
*/

var randomStart = getRandomInt(5000, 60000);
var dtaRenwalDelay = getRandomInt(60000, 600000);
console.log('First data call will occur in '+ (randomStart / 1000).toFixed(2) + ' seconds.');
console.log('The data renewal and data tx timmers will start ' + (dtaRenwalDelay / 60000).toFixed(2) + ' minutes after first data call.')

console.log('After the first data call an update will be made every ' + getDataInterveral.toFixed(2) + ' minutes.');
console.log('Valid data will be sent to the gauge as soon as it is received. ');


setTimeout(()  =>{
    getSolarData();
}, randomStart);                     

setTimeout(()=>{
    console.log('Get data and tx data timmers starting now.')
    setInterval(()=>{getSolarData()}, getDataInterveral * 60 * 1000);
},dtaRenwalDelay + randomStart);


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  };