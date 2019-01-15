# sbPowerGauge (Data Delegate)
This Node.JS app reads the real-time solar production value in kilowatts from a SMA Sunny WebBox via its REST API.  The solar production value is then sent to a physical battery powered gauge for display with the [irdTxClass ]( https://github.com/RuckerGauge/irdTxClass).  This application is intended to run on a Raspberry Pi Zero W configured as the Gauge Data Transmitter (see [irdTxServer ]( https://github.com/RuckerGauge/irdTxServer)).   
![pic of Power Gauge](/pics/solarPowerGauge.png)
## Hardware Requirements
1. Raspberry Pi Zero W
1. rGauge.com Gauge Data Transmitter Daughterboard.
## Software Requirements (must be installed before Install)
1. Raspbian Stretch Lite with a build date of November 13, 2018 (newer versions should work but not tested yet)
2. Node.js v10.14. Older versions may work just not been tested. 
3. git
4. Bluez v5.50 [Raspberry Pi Zero W Bluez v5.50 upgrade steps ](https://github.com/RuckerGauge/Raspberry-Pi-Zero-W-Bluez-5.50-upgrade-steps)
5. [irdTxServer ]( https://github.com/RuckerGauge/irdTxServer) installed and running (waiting for gauge data).
6. [rgMan](https://github.com/RuckerGauge/rgMan) installed and running.   
## Install
On the Raspberry Pi Zero W from a [SSH session](https://www.raspberrypi.org/magpi/ssh-remote-control-raspberry-pi/):  
* Create a the rgservice system user account (if not already created) by typing `sudo adduser rgservice --system --ingroup irdclient`
* type `cd /opt/rGauge/gList`.  All rGauge apps are installed from this directory.  The directory should already exist if [rgMan](https://github.com/RuckerGauge/rgMan) has been installed correctly.
* type `git clone https://github.com/RuckerGauge/sbPowerGauge.git`
  * This will create a new subdirectory and download the latest version of this node.js app.
* type `cd sbPowerGauge`
* type `npm install`
  * The npm install process will install the node dependencies and then call the configuration script [./postinstall/installAsService.sh]( https://github.com/RuckerGauge/sbPowerGauge/blob/master/postInstall/installAsService.sh).  This bash file will install this app as a service and set it to auto start on reboot. 

At this point the app should be up and running as a service  and you can use the `journalctl -u sbPowerGauge -f` command to see running status log.

## Configure the application to use your SunnyBoy Web Box
You will need to set the IP address of your SunnyBoy Web Box.  This is done over BLE and requires our (not released yet) ios (iPhone or iPad) app.  As a workaround you can use LightBlue | Explorer to find and connect to this device and set the IP address.  This workaround will also work on an Android device. 

**To Do:  Add instructions for configuring this app with Lightblue | Explorer**

## More Gauge pictures:
![pic of Power Gauge](/pics/solarPowerGaugeOpenTop.png)
![pic of Power Gauge](/pics/solarPowerGaugeOpenBottom.png)
