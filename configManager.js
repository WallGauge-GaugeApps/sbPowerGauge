const fs =                  require("fs");
const EventEmitter =        require('events');
const BLEperipheral =       require("ble-peripheral");
const defaultGaugeConfig =  require("./gaugeConfig.json");

const modifiedConfigFilePath = './modifiedConfig.json';
var modifiedConfigMaster = {};

if (fs.existsSync(modifiedConfigFilePath)){
    modifiedConfigMaster = JSON.parse(fs.readFileSync(modifiedConfigFilePath))
};

var Config = {...defaultGaugeConfig, ...modifiedConfigMaster}

var bleIface = new BleIface();

class gaugeConfig extends EventEmitter{
    constructor(){
        super();
        this.descripition = Config.descripition;
        this.calibrationTable = Config.calibrationTable;
        this.gaugeIrAddress = Config.gaugeIrAddress;
        this.webBoxIP = bleIface.webBoxIP;
    };

    setWebBoxIP(ipAdd = '10.1.1.5'){
        saveItem({webBoxIP:ipAdd});
        this.webBoxIP = Config.webBoxIP;
        console.log('firing "Update" event...');
        this.emit('Update');
    };
};

class BleIface extends EventEmitter{
    constructor(){
        super();
        this.dBusName = Config.dBusName;
        this.uuid = Config.uuid;
        this.bPrl = new BLEperipheral(this.dBusName, this.uuid, this.bleMain, false);
        this.webBoxIP = Config.webBoxIP;
    }

    bleMain(DBus){
        var cfg = new gaugeConfig();
        bPrl.logCharacteristicsIO = true;
        console.log('Initialize charcteristics...')
        var webBoxIp = bPrl.Characteristic('00000001-fe9e-4f7b-b56a-5f8294c6d817', 'webBoxIp', ["encrypt-read","encrypt-write"]);
    
        console.log('Registering event handlers...');
        webBoxIp.on('WriteValue', (device, arg1)=>{
            console.log(device + ', has set new IP Address of ' + arg1);
            webBoxIp.setValue(arg1);
            var x = arg1.toString('utf8');
            cfg.setWebBoxIP(x);
            saveItem({webBoxIP:ipAdd});
            this.webBoxIP = Config.webBoxIP;
            console.log('firing "Update" event...');
            this.emit('Update');



        });
    
        console.log('setting default characteristic values...');
        webBoxIp.setValue(cfg.webBoxIP);
    };


}

/*
var bPrl = new BLEperipheral(Config.dBusName, Config.uuid, bleMain, false);
function bleMain(DBus){
    var cfg = new gaugeConfig();
    bPrl.logCharacteristicsIO = true;
    console.log('Initialize charcteristics...')
    var webBoxIp = bPrl.Characteristic('00000001-fe9e-4f7b-b56a-5f8294c6d817', 'webBoxIp', ["encrypt-read","encrypt-write"]);

    console.log('Registering event handlers...');
    webBoxIp.on('WriteValue', (device, arg1)=>{
        console.log(device + ', has set new IP Address of ' + arg1);
        webBoxIp.setValue(arg1);
        var x = arg1.toString('utf8');
        cfg.setWebBoxIP(x);
    });

    console.log('setting default characteristic values...');
    webBoxIp.setValue(cfg.webBoxIP);
};
*/

function saveItem(itemsToSaveAsObject){
    console.log('saveItem called with:');
    console.log(itemsToSaveAsObject);

    var itemList = Object.keys(itemsToSaveAsObject);
    itemList.forEach((keyName)=>{
        modifiedConfigMaster[keyName] = itemsToSaveAsObject[keyName];
    })
    console.log('Writting file to ' + modifiedConfigFilePath);
    fs.writeFileSync(modifiedConfigFilePath, JSON.stringify(modifiedConfigMaster));
    reloadConfig();
};

function reloadConfig(){
    if (fs.existsSync(modifiedConfigFilePath)){
        modifiedConfigMaster = JSON.parse(fs.readFileSync(modifiedConfigFilePath))
    };
    Config = {...defaultGaugeConfig, ...modifiedConfigMaster}
    console.log('config reloaded...');
};

module.exports = gaugeConfig;
