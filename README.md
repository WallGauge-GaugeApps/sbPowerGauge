# sbPowerGauge (Data Delegate)
This Node.JS app reads the real-time solar production value in kilowatts from a SMA Sunny WebBox via its REST API.  The solar production value is then sent to a physical battery powered gauge for display with the [irdTxClass ]( https://github.com/RuckerGauge/irdTxClass).  This application is intended to run on a Raspberry Pi Zero W configured as the Gauge Data Transmitter (see [irdTxServer ]( https://github.com/RuckerGauge/irdTxServer)).   
![pic of Power Gauge](/pics/solarPowerGauge.png)
## Hardware Requirements
1. Raspberry Pi Zero W
1. RuckerGauge.com Gauge Data Transmitter Daughterboard.
## Software Requirements (must be installed before Install)
1. Raspbian Stretch Lite
2. Node.js v8.5 or newer
3. git
4. [irdTxServer ]( https://github.com/RuckerGauge/irdTxServer) installed and running (waiting for gauge data).
## Install
On the Raspberry Pi Zero W from a [SSH session](https://www.raspberrypi.org/magpi/ssh-remote-control-raspberry-pi/):  
* Create a the rgservice system user account (if not already created) by typing `sudo adduser rgservice --system --ingroup irdclient`
* type `cd /opt/rGauge/gList`.  All Rucker Gauge apps are installed from this directory
* type `git clone https://github.com/RuckerGauge/sbPowerGauge.git`
  * This will create a new subdirectory and download the latest version of this node.js app.
* type `cd sbPowerGauge`
* type `npm install` to install all node dependences.

## Configure the applicaiton to use your SunnyBoy Web Box
Open the gaugeConfig.json and add your SunnyBoy Web Box's IP address to the "WebBoxIP" setting.
From the /opt/rGauge/sbPowerGauge directory type `nano gaugeConfig.json`, to edit file. Then save and reboot the Raspberry Pi.

## More Gauge pictures:
![pic of Power Gauge](/pics/solarPowerGaugeOpenTop.png)
![pic of Power Gauge](/pics/solarPowerGaugeOpenBottom.png)
