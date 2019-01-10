const fs =                  require("fs");
const EventEmitter =        require('events');
const BLEperipheral =       require("ble-peripheral");
const defaultGaugeConfig =  require("./gaugeConfig.json");

const modifiedConfigFilePath = './modifiedConfig.json';
var modifiedConfigMaster = {};

if (fs.existsSync(modifiedConfigFilePath)){
    modifiedConfigMaster = JSON.parse(fs.readFileSync(modifiedConfigFilePath))
};

var Config = {...defaultGaugeConfig, ...modifiedConfigMaster};
var bPrl;
var self;
var gaugeValue;
var gaugeStatus;

class gaugeConfig extends EventEmitter{
    constructor(){
        super();
        this.descripition = Config.descripition;
        this.calibrationTable = Config.calibrationTable;
        this.gaugeIrAddress = Config.gaugeIrAddress;
        this.webBoxIP = Config.webBoxIP;
        this.status = 'ipl, ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString();
        this.value = 'unknown'
        self = this;
        bPrl = new BLEperipheral(Config.dBusName, Config.uuid, bleMain, false);
    };

    setWebBoxIP(ipAdd = '10.1.1.5'){
        saveItem({webBoxIP:ipAdd});
    };

    setGaugeValue(valueStr){
        this.value = valueStr;
        gaugeValue.setValue(valueStr);
        if(gaugeValue.iface.Notifying){
            gaugeValue.notify();
        };
    };

    setGaugeStatus(statusStr){
        this.status = statusStr;
        gaugeStatus.setValue(statusStr);
        if(gaugeStatus.iface.Notifying){
            gaugeStatus.notify();
        };
    };    

};

function bleMain(DBus){
    bPrl.logCharacteristicsIO = true;
    console.log('Initialize charcteristics...')
    gaugeStatus =   bPrl.Characteristic('00000001-fe9e-4f7b-b56a-5f8294c6d817', 'gaugeStatus', ["encrypt-read","notify"]);
    gaugeValue =    bPrl.Characteristic('00000002-fe9e-4f7b-b56a-5f8294c6d817', 'gaugeValue', ["encrypt-read","notify"]);
    gaugeCommand =  bPrl.Characteristic('00000003-fe9e-4f7b-b56a-5f8294c6d817', 'gaugeCommand', ["encrypt-write"]);
    var webBoxIp =  bPrl.Characteristic('00000010-fe9e-4f7b-b56a-5f8294c6d817', 'webBoxIp', ["encrypt-read","encrypt-write"]);

    console.log('Registering event handlers...');
    webBoxIp.on('WriteValue', (device, arg1)=>{
        console.log(device + ', has set new IP Address of ' + arg1);
        webBoxIp.setValue(arg1);
        var x = arg1.toString('utf8');
        self.webBoxIP=x;
        saveItem({webBoxIP:x});
    });

    console.log('setting default characteristic values...');
    webBoxIp.setValue(Config.webBoxIP);
    gaugeValue.setValue(self.value);
    gaugeStatus.setValue(self.staus)
};

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
    console.log('config reloading...');
    if (fs.existsSync(modifiedConfigFilePath)){
        modifiedConfigMaster = JSON.parse(fs.readFileSync(modifiedConfigFilePath))
    };
    Config = {...defaultGaugeConfig, ...modifiedConfigMaster}
    console.log('firing "Update" event...');
    self.emit('Update');
};

module.exports = gaugeConfig;
