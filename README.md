# sbPowerGauge (Data Delegate)

This Node.JS app reads the real-time solar production value in kilowatts from a SMA Sunny WebBox via its REST API. The solar production value is then sent to a physical battery powered gauge for display with the [irdTxClass](https://github.com/WallGauge/irdTxClass). This application is intended to run on a Raspberry Pi Zero W configured as the Gauge Data Transmitter (see [irdTxServer](https://github.com/WallGauge/irdTxServer)).

## Hardware Requirements

1. Raspberry Pi Zero W
1. rGauge.com Gauge Data Transmitter Daughterboard.

## Software Requirements (must be installed before Install)

1. Raspbian Stretch Lite with a build date of November 13, 2018 (newer versions should work but not tested yet)
2. Node.js v10.14. Older versions may work just not been tested.
3. git
4. Bluez v5.50 [Raspberry Pi Zero W Bluez v5.50 upgrade steps](https://github.com/WallGauge/Raspberry-Pi-Zero-W-Bluez-5.50-upgrade-steps)
5. [irdTxServer](https://github.com/WallGauge/irdTxServer) installed and running (waiting for gauge data).
6. [gdtMan](https://github.com/WallGauge/gdtMan) installed and running.

The gdtMan app will automatically install this application so the following steps are only necessary if not using gdtMan.

---

## Manual Install Steps

On the Raspberry Pi Zero W from a [SSH session](https://www.raspberrypi.org/magpi/ssh-remote-control-raspberry-pi/):  

* Create the irdclient group `sudo groupadd --system irdclient`
* Create a the rgservice system user account (if not already created) by typing `sudo adduser rgservice --system --ingroup irdclient`
* type `cd /opt/rGauge/gList`.  All rGauge apps are installed from this directory.  The directory should already exist if [gdtMan](https://github.com/WallGauge/gdtMan) has been installed correctly.
* type `git clone https://github.com/WallGauge/sbPowerGauge.git`
  * This will create a new subdirectory and download the latest version of this node.js app.
* type `cd sbPowerGauge`
* type `npm install`
  * The npm install process will install the node dependencies.

## Files to change if modifying

* gaugeConfig.json
* package.json
* *.conf file
* *.service file
* installAsService.sh From DOS prompt type (git update-index --chmod=+x installAsService.sh) to make this file executable.
* un-installAsService.sh From DOS prompt type (git update-index --chmod=+x un-installAsService.sh) to make this file executable.
