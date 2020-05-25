const sunnyBoyWebBox = require('./dataGetter/sunnyboyWebBoxClass.js');
const MyAppMan = require('./MyAppManager.js');

overrideLogging();

const myAppMan = new MyAppMan(__dirname + '/gaugeConfig.json', __dirname + '/modifiedConfig.json', false);
var inAlert = false;

const getDataInterveral = 1;   // Time in minutes

console.log('__________________ App Config follows __________________');
console.dir(myAppMan.config, { depth: null });
console.log('________________________________________________________');

var solarData = new sunnyBoyWebBox(myAppMan.config.webBoxIP);

function getSolarData() {
    solarData.updateValues(function (errNumber, errTxt, dtaObj) {
        if (errNumber == 0) {
            console.log('Currently generating ' + dtaObj.powerNow + " " + dtaObj.powerNowUnit);
            //console.log("\tToday's total power = " + dtaObj.powerToday + " " + dtaObj.powerTodayUnit);
            //console.log('\tTotal all time power generated = '+ dtaObj.powerToday + " " + dtaObj.powerTodayUnit);

            myAppMan.setGaugeValue(dtaObj.powerNow, ' watts, ' +
                dtaObj.powerToday + " " + dtaObj.powerTodayUnit + ", " +
                (new Date()).toLocaleTimeString());

            myAppMan.setGaugeStatus('Okay, ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString());
            if (inAlert == true) {
                myAppMan.sendAlert({ [myAppMan.config.descripition]: "0" });
                inAlert = false;
            };

        } else {
            console.log('Error getting data from Sunnyboy WebBox');
            console.log(errTxt);
            myAppMan.setGaugeStatus('Error getting data from SunnyBoy Webbox at ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString() + ' -> ' + errTxt);
            if (inAlert == false) {
                myAppMan.sendAlert({ [myAppMan.config.descripition]: "1" });
                inAlert = true;
            };
        };
    });
};

myAppMan.on('Update', () => {
    console.log('New update event has fired.  Reloading gauge objects...');
    myAppMan.setGaugeStatus('Config updated received. Please wait, may take up to 5 minutes to reload gauge objects. ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString());
    console.log('The webBoxIP = ' + myAppMan.config.webBoxIP);
    solarData = new sunnyBoyWebBox(myAppMan.config.webBoxIP);
    getSolarData();
});

var randomStart = getRandomInt(5000, 60000);
var dtaRenwalDelay = getRandomInt(60000, 600000);
console.log('First data call will occur in ' + (randomStart / 1000).toFixed(2) + ' seconds.');
console.log('The data renewal and data tx timmers will start ' + (dtaRenwalDelay / 60000).toFixed(2) + ' minutes after first data call.')

console.log('After the first data call an update will be made every ' + getDataInterveral.toFixed(2) + ' minutes.');
console.log('Valid data will be sent to the gauge as soon as it is received. ');


setTimeout(() => {
    getSolarData();
}, randomStart);

setTimeout(() => {
    console.log('Get data and tx data timmers starting now.')
    setInterval(() => { getSolarData() }, getDataInterveral * 60 * 1000);
}, dtaRenwalDelay + randomStart);


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

/** Overrides console.error, console.warn, and console.debug
 * By placing <#> in front of the log text it will allow us to filter them with systemd
 * For example to just see errors and warnings use journalctl with the -p4 option 
 */
function overrideLogging() {
    const orignalConErr = console.error;
    const orignalConWarn = console.warn;
    const orignalConDebug = console.debug;
    console.error = ((data = '', arg = '') => { orignalConErr('<3>' + data, arg) });
    console.warn = ((data = '', arg = '') => { orignalConWarn('<4>' + data, arg) });
    console.debug = ((data = '', arg = '') => { orignalConDebug('<7>' + data, arg) });
};