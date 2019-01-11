const fs =                  require("fs");
const EventEmitter =        require('events');
const irTransmitter =       require('irdtxclass');
const BLEperipheral =       require("ble-peripheral");
const defaultGaugeConfig =  require("./gaugeConfig.json");

const modifiedConfigFilePath = './modifiedConfig.json';
var modifiedConfigMaster = {};

if (fs.existsSync(modifiedConfigFilePath)){
    modifiedConfigMaster = JSON.parse(fs.readFileSync(modifiedConfigFilePath))
};

var Config = {...defaultGaugeConfig, ...modifiedConfigMaster};

var gTx = new irTransmitter(Config.gaugeIrAddress, Config.calibrationTable);

//var bPrl;
var self;
var gaugeValue;
var gaugeStatus;

class gaugeConfig extends EventEmitter{
    constructor(){
        super();
        this.descripition = Config.descripition;
        this.calibrationTable = Config.calibrationTable;
        this.gaugeIrAddress = Config.gaugeIrAddress;
        //this.webBoxIP = Config.webBoxIP;
        this.status = 'ipl, ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString();
        this.value = 'unknown';
        this.rGaugeCmdTable = gTx._calibrationTable
        this._okToSend = true;
        this.config = Config;
        this.bPrl = new BLEperipheral(Config.dBusName, Config.uuid, this.bleMasterConfig, false);
        self = this;
        
    };

    setWebBoxIP(ipAdd = '10.1.1.5'){
        this.saveItem({webBoxIP:ipAdd});
    };

    setGaugeValue(value){
        if(this._okToSend){
            gTx.sendValue(value);
        } else {
            this.setGaugeStatus('Warining: Gauge value transmission not allowed during adminstration.')
            return false;
        };
        var logValue = value.toString() + ', ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString();
        this.value = logValue;
        gaugeValue.setValue(logValue);
        if(gaugeValue.iface.Notifying){
            gaugeValue.notify();
        };
        return true;
    };

    setGaugeStatus(statusStr){
        this.status = statusStr;
        gaugeStatus.setValue(statusStr);
        if(gaugeStatus.iface.Notifying){
            gaugeStatus.notify();
        };
    };    

    bleMyConfig(){
        console.log('No user specfic configuraton for appManger using default characteristics only.');
    }

    bleMasterConfig(DBus){
        self.bPrl.logCharacteristicsIO = true;
        console.log('Initialize charcteristics...')
        gaugeStatus =       self.bPrl.Characteristic('00000001-fe9e-4f7b-b56a-5f8294c6d817', 'gaugeStatus', ["encrypt-read","notify"]);
        gaugeValue =        self.bPrl.Characteristic('00000002-fe9e-4f7b-b56a-5f8294c6d817', 'gaugeValue', ["encrypt-read","notify"]);
        var gaugeCommand =  self.bPrl.Characteristic('00000003-fe9e-4f7b-b56a-5f8294c6d817', 'gaugeCommand', ["encrypt-write"]);
    
        console.log('Registering event handlers...');
        gaugeCommand.on('WriteValue', (device, arg1)=>{
            var cmdNum = arg1[0];
            var cmdValue = arg1[1]
            console.log(device + ' has sent a new gauge command: number = ' + cmdNum + ', value = ' + cmdValue);
    
            switch (cmdNum) {
                case 0:
                    console.log('Sending test battery to gauge...');
                    gTx.sendEncodedCmd(gTx.encodeCmd(gTx._cmdList.Check_Battery_Voltage));
                break;
        
                case 1:
                    console.log('Sending gauge reset request ');
                    gTx.sendEncodedCmd(gTx.encodeCmd(gTx._cmdList.Reset));
                break;
    
                case 2:
                    console.log('Sending gauge Zero Needle request ');
                    gTx.sendEncodedCmd(gTx.encodeCmd(gTx._cmdList.Zero_Needle));
                break;          
        
                case 15:
                    console.log('Sending Identifify gauge request')
                    gTx.sendEncodedCmd(gTx.encodeCmd(gTx._cmdList.Identifify));
                break;
    
                case 20:
                    console.log('Disable normal gauge value TX during adminstration.')
                    self._okToSend = false;
                    gTx.sendEncodedCmd(0);
                break;
        
                case 21:
                    console.log('Enable normal gauge value TX.')
                    self._okToSend = true;
                break;
            
                default:
                    console.log('no case for ' + cmdNum);
                break;
            }
          });   
        
        console.log('setting default characteristic values...');
        gaugeValue.setValue(self.value);
        gaugeStatus.setValue(self.staus)

        self.bleMyConfig();
    };

    saveItem(itemsToSaveAsObject){
        console.log('saveItem called with:');
        console.log(itemsToSaveAsObject);
    
        var itemList = Object.keys(itemsToSaveAsObject);
        itemList.forEach((keyName)=>{
            modifiedConfigMaster[keyName] = itemsToSaveAsObject[keyName];
        })
        console.log('Writting file to ' + modifiedConfigFilePath);
        fs.writeFileSync(modifiedConfigFilePath, JSON.stringify(modifiedConfigMaster));
        this.reloadConfig();
    };

    reloadConfig(){
        console.log('config reloading...');
        if (fs.existsSync(modifiedConfigFilePath)){
            modifiedConfigMaster = JSON.parse(fs.readFileSync(modifiedConfigFilePath))
        };
        Config = {...defaultGaugeConfig, ...modifiedConfigMaster}
        console.log('firing "Update" event...');
        self.emit('Update');
    };

};

/*
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
*/
module.exports = gaugeConfig;
