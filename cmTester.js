var Config = require("./configManager.js");

const config = new Config();

console.log('Gauge Name = ' + config.descripition);
console.log('Bluetooth LE UUID = ' + config.uuid);
console.log('Gauge IP Address = ' + config.webBoxIP);
config.setWebBoxIP('1.2.3.4');
console.log('Gauge IP Address after change = ' + config.webBoxIP);