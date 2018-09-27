# sbPowerGauge
This Node.JS app reads the real time solar production in kilowatts from a SunnyBoy Web Box via its REST API.  The solar production value is then sent to a physical battery powered gauge for display with the [irdTxClass ]( https://github.com/RuckerGauge/irdTxClass).  This application is intended to run on a Raspberry Pi Zero W configured as the Gauge Data Transmitter (see [irdTxServer ]( https://github.com/RuckerGauge/irdTxServer)).   
![pic of Power Gauge](/pics/solarPowerGauge.png)
## Hardware Requirements
1. Raspberry Pi Zero W
1. RuckerGauge.com Gauge Data Transmitter daughter board.
## Software Requirements (must be installed before Install)
1. Raspbian Stretch Lite
2. Node.js v8.5 or newer
3. git
4. pigpio
## Install
On the Raspberry Pi Zero W from a [SSH session](https://www.raspberrypi.org/magpi/ssh-remote-control-raspberry-pi/):
* type `sudo mkdir /opt/rGauge` if directory doesn't already exist.
* type `sudo sudo chown -R pi /opt/rGauge` to give the user pi ownership of the new directory.
  * If your logged in as a user other than pi replace pi in the above command with your user name.  
* type `cd /opt/rGauge`.  All Rucker Gauge apps are installed from this directory
* type `git clone https://github.com/RuckerGauge/sbPowerGauge.git`
  * This will download the latest version of this node.js app to a subdirectory
* type `cd sbPowerGauge`
* type `npm install` to install all node dependences
* Install the service configuration file `sudo cp /opt/rGauge/sbPowerGauge/sbPowerGauge.service /etc/systemd/system`
* type `sudo systemctl enable sbPowerGauge.service` to enable auto startup of the servers when the Pi is rebooted. 
* type `sudo systemctl start sbPowerGauge.service` to start the service now.
* type `sudo systemctl status sbPowerGauge.service` to see the status of the service.  You can also use `sudo tail -f /var/log/syslog' to see real time log information.  
### Above commands in a Linux chain (after making /opt/rGauge directory).
`cd /opt/rGauge ; git clone https://github.com/RuckerGauge/sbPowerGauge.git ; cd sbPowerGauge ; npm install ; sudo cp /opt/rGauge/sbPowerGauge/sbPowerGauge.service /etc/systemd/system ; sudo systemctl enable sbPowerGauge.service ; sudo systemctl start sbPowerGauge.service ; sudo systemctl status sbPowerGauge.service `
## Configure the applicaiton to use your SunnyBoy Web Box
Open the gaugeConfig.json and add your SunnyBoy Web Box's IP address to the "WebBoxIP" setting.
From the /opt/rGauge/sbPowerGauge directory type `nano gaugeConfig.json`, to edit file. Then save and reboot the Raspberry Pi.

## More Gauge pictures:
![pic of Power Gauge](/pics/solarPowerGaugeOpenTop.png)
![pic of Power Gauge](/pics/solarPowerGaugeOpenBottom.png)
