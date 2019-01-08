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
var bPrl={};
var parent={};

class gaugeConfig extends EventEmitter{
    constructor(){
        super();
        this.descripition = Config.descripition;
        this.uuid = Config.uuid;
        this.dBusName = Config.dBusName;
        this.calibrationTable = Config.calibrationTable;
        this.gaugeIrAddress = Config.gaugeIrAddress;
        this.webBoxIP = Config.webBoxIP;

        bPrl = new BLEperipheral(this.dBusName, this.uuid, this._bleMain, false);
        parent = this;
    };

    setWebBoxIP(ipAdd = '10.1.1.5'){
        saveItem({webBoxIP:ipAdd});
        this.webBoxIP = Config.webBoxIP;
        this.emit('Update');
    }

    _bleMain(DBus){
        bPrl.logCharacteristicsIO = true;
        console.log('Initialize charcteristics...')
        var webBoxIp = bPrl.Characteristic('00000001-fe9e-4f7b-b56a-5f8294c6d817', 'webBoxIp', ["encrypt-read","encrypt-write"]);

        console.log('Registering event handlers...');
        webBoxIp.on('WriteValue', (device, arg1)=>{
            console.log(device + ', has set new IP Address of ' + arg1);
            webBoxIp.setValue(arg1);

            //console.log('_____________and now this______________')
            //console.dir(parent, {depth: null});

            saveItem({webBoxIP:arg1});
            parent.webBoxIP = Config.webBoxIP;
            parent.emit('Update');
        });

        console.log('setting default characteristic values...');
        webBoxIp.setValue(Config.webBoxIP);
    };
}

function saveItem(itemsToSaveAsObject){
    console.log('saveItem called with:');
    console.log(itemsToSaveAsObject);

    var itemList = Object.keys(itemsToSaveAsObject);
    itemList.forEach((keyName)=>{
        modifiedConfigMaster[keyName] = itemsToSaveAsObject[keyName];
    })
    fs.writeFileSync(modifiedConfigFilePath, JSON.stringify(modifiedConfigMaster));
    reloadConfig();
}

function reloadConfig(){
    if (fs.existsSync(modifiedConfigFilePath)){
        modifiedConfigMaster = JSON.parse(fs.readFileSync(modifiedConfigFilePath))
    };
    Config = {...defaultGaugeConfig, ...modifiedConfigMaster}
    console.log('config reloaded...');
}

module.exports = gaugeConfig;
