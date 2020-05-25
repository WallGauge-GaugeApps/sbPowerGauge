var sunnyBoyWebBox = require('./sunnyboyWebBoxClass.js');
var package = require('./package.json');

var wb = new sunnyBoyWebBox("10.50.0.50");

var x = package.version;
console.log('class ver = ' + x);

console.log('Making first request for power data from sunnyBoy Web Box...');
getPowerData();
console.log('Will repeat every 30 seconds.');

setInterval(function () {
    getPowerData();
}, 30000);

function getPowerData() {
    wb.updateValues(function (errNumber, errTxt, dtaObj) {
        if (errNumber == 0) {
            console.log('Currently generating ' + dtaObj.powerNow + " " + dtaObj.powerNowUnit);
            console.log("\tToday's total power = " + dtaObj.powerToday + " " + dtaObj.powerTodayUnit);
            console.log('\tTotal all time power generated = ' + dtaObj.powerTotal + " " + dtaObj.powerTotalUnit);
        }
    })
}