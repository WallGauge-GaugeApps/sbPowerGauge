const AppManager = require("./appManagerClass.js");

//"webBoxIP":"10.50.0.50"

class myAppManager extends AppManager{
   
    bleMyConfig(){
        console.log('Setting up sbPowerGauge specfic characteristics and config.'); 
        var webBoxIp = this.bPrl.Characteristic('00000010-fe9e-4f7b-b56a-5f8294c6d817', 'webBoxIp', ["encrypt-read","encrypt-write"]);

        webBoxIp.on('WriteValue', (device, arg1)=>{
            console.log(device + ', has set new IP Address of ' + arg1);
            webBoxIp.setValue(arg1);
            var x = arg1.toString('utf8');
            this.saveItem({webBoxIP:x});        //this vairable will be accessable with this.config.webBoxIP
        });

        webBoxIp.setValue(this.webBoxIP);
    };
};

module.exports = myAppManager;