const AppManager = require("./appManagerClass.js");

//"webBoxIP":"10.50.0.50"

class myAppManager extends AppManager{
    constructor(){
        super();
        this.webBoxIP = this.config.webBoxIP;
    };
/*
    myConfigHasBeenUpdate(){
        console.log('New configuration file has been loaded.  Updateing my variables.');
        this.webBoxIP = this.config.webBoxIP
    }
  */  
    bleMyConfig(){
        console.log('Setting up sbPowerGauge specfic characteristics and config.'); 
        var webBoxIp = this.bPrl.Characteristic('00000010-fe9e-4f7b-b56a-5f8294c6d817', 'webBoxIp', ["encrypt-read","encrypt-write"]);

        webBoxIp.on('WriteValue', (device, arg1)=>{
            console.log(device + ', has set new IP Address of ' + arg1);
            webBoxIp.setValue(arg1);
            var x = arg1.toString('utf8');
            this.webBoxIP=x;
            this.saveItem({webBoxIP:x});
        });

        webBoxIp.setValue(this.webBoxIP);
    };
};

module.exports = myAppManager;