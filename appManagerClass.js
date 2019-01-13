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
var self;

class appManager extends EventEmitter{
    constructor(){
        super();
        this.descripition = Config.descripition;
        this.calibrationTable = Config.calibrationTable;
        this.gaugeIrAddress = Config.gaugeIrAddress;
        this.uuid = Config.uuid
        this.dBusName = Config.dBusName
        this.status = 'ipl, ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString();
        this.value = 'Not Set Yet';
        this._okToSend = true;
        this.config = Config;
        this.gTx = new irTransmitter(this.gaugeIrAddress, this.calibrationTable);
        this.bPrl = new BLEperipheral(this.dBusName, this.uuid, this._bleConfig, false);
        self = this;  
    };

    _bleConfig(DBus){
        self._bleMasterConfig();
        self.bleMyConfig();
    }

    setGaugeValue(value){
        if(this._okToSend){
            this.gTx.sendValue(value);
        } else {
            this.setGaugeStatus('Warining: Gauge value transmission not allowed during adminstration.')
            return false;
        };
        var logValue = value.toString() + ', ' + (new Date()).toLocaleTimeString() + ', ' + (new Date()).toLocaleDateString();
        this.value = logValue;
        this.gaugeValue.setValue(logValue);
        if(this.gaugeValue.iface.Notifying){
            this.gaugeValue.notify();
        };
        return true;
    };

    setGaugeStatus(statusStr){
        this.status = statusStr;
        this.gaugeStatus.setValue(statusStr);
        if(this.gaugeStatus.iface.Notifying){
            this.gaugeStatus.notify();
        };
    };    

    bleMyConfig(){
        console.log('No user specfic configuraton for appManger using default characteristics only.');
    }

    _bleMasterConfig(){
        this.bPrl.logCharacteristicsIO = true;
        console.log('Initialize charcteristics...')
        this.gaugeStatus =       this.bPrl.Characteristic('00000001-fe9e-4f7b-b56a-5f8294c6d817', 'gaugeStatus', ["encrypt-read","notify"]);
        this.gaugeValue =   this.bPrl.Characteristic('00000002-fe9e-4f7b-b56a-5f8294c6d817', 'gaugeValue', ["encrypt-read","notify"]);
        var gaugeCommand =  this.bPrl.Characteristic('00000003-fe9e-4f7b-b56a-5f8294c6d817', 'gaugeCommand', ["encrypt-write"]);
    
        console.log('Registering event handlers...');
        gaugeCommand.on('WriteValue', (device, arg1)=>{
            var cmdNum = arg1[0];
            var cmdValue = arg1[1]
            console.log(device + ' has sent a new gauge command: number = ' + cmdNum + ', value = ' + cmdValue);
    
            switch (cmdNum) {
                case 0:
                    console.log('Sending test battery to gauge...');
                    this.gTx.sendEncodedCmd(this.gTx.encodeCmd(this.gTx._cmdList.Check_Battery_Voltage));
                break;
        
                case 1:
                    console.log('Sending gauge reset request ');
                    this.gTx.sendEncodedCmd(this.gTx.encodeCmd(this.gTx._cmdList.Reset));
                break;
    
                case 2:
                    console.log('Sending gauge Zero Needle request ');
                    this.gTx.sendEncodedCmd(this.gTx.encodeCmd(this.gTx._cmdList.Zero_Needle));
                break;          
        
                case 15:
                    console.log('Sending Identifify gauge request')
                    this.gTx.sendEncodedCmd(this.gTx.encodeCmd(this.gTx._cmdList.Identifify));
                break;
    
                case 20:
                    console.log('Disable normal gauge value TX during adminstration.')
                    this._okToSend = false;
                    this.gTx.sendEncodedCmd(0);
                break;
        
                case 21:
                    console.log('Enable normal gauge value TX.')
                    this._okToSend = true;
                break;
            
                default:
                    console.log('no case for ' + cmdNum);
                break;
            }
          });   
        
        console.log('setting default characteristic values...');
        this.gaugeValue.setValue(this.value);
        this.gaugeStatus.setValue(this.status)
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
        this.emit('Update');
    };

};

module.exports = appManager;
