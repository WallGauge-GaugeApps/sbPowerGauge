const sunnyBoyWebBox =  require('sunnyboy-web-box-data-fetcher');
const MyAppMan =        require('./MyAppManager.js');

const myAppMan = new MyAppMan(__dirname + '/gaugeConfig.json', __dirname + '/modifiedConfig.json');

console.log('__________________ App Config follows __________________');
console.dir(myAppMan.config, {depth: null});
console.log('________________________________________________________');

var solarData =  new sunnyBoyWebBox(myAppMan.config.webBoxIP);

setTimeout(()  =>{getSolarData();}, 5000);                     // wait 5 seconds and then send gauge values (only ran once)
setInterval(() =>{getSolarData();}, 5 * 60 * 1000);            // every 5 minutes 

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
            myAppMan.setGaugeStatus('Error getting data from SunnyBoy Webbox at ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString()  + ' -> '+ errTxt);
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
