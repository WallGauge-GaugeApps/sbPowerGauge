const AppManager =      require('./appManager.js');

class myAppManager extends AppManager(){
    bleMyConfig(){
        console.log('setting up my characteristics');
        var webBoxIp =      bPrl.Characteristic('00000010-fe9e-4f7b-b56a-5f8294c6d817', 'webBoxIp', ["encrypt-read","encrypt-write"]);

        webBoxIp.on('WriteValue', (device, arg1)=>{
            console.log(device + ', has set new IP Address of ' + arg1);
            webBoxIp.setValue(arg1);
            var x = arg1.toString('utf8');
            self.webBoxIP=x;
            saveItem({webBoxIP:x});
        });

        webBoxIp.setValue(Config.webBoxIP);
    }
}

module.exports = myAppManager;