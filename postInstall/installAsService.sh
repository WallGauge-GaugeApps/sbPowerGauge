#!/bin/bash
# From DOS prompt type (git update-index --chmod=+x installAsService.sh) to make this file executable.
set -e
echo "NPM post install shell that installs this app as service starts now..."
echo "Set irdclient as defalut group for sbPowerGauge -> sudo chown :irdclient ../sbPowerGauge"
sudo chown :irdclient ../sbPowerGauge
echo "Give default group write access to the sbPowerGauge directory -> sudo chmod g+w ../sbPowerGauge"
sudo chmod g+w ../sbPowerGauge
echo "Install D-Bus config file for this service -> sudo cp ./postInstall/dbus.conf /etc/dbus-1/system.d/sbPowerGauge.conf"
sudo cp ./postInstall/dbus.conf /etc/dbus-1/system.d/sbPowerGauge.conf
echo "Install systemd service file -> sudo cp -n ./postInstall/server.service /etc/systemd/system/sbPowerGauge.service"
sudo cp -n ./postInstall/server.service /etc/systemd/system/sbPowerGauge.service
echo "Enable the servers to start on reboot -> systemctl enable sbPowerGauge.service"
sudo systemctl enable sbPowerGauge.service
echo "Start the service now -> systemctl start sbPowerGauge.service"
sudo systemctl start sbPowerGauge.service
echo "NPM Post install shell is complete."
#echo "To start this servers please reboot the server. After reboot Type -> journalctl -u sbPowerGauge -f <- to see status."