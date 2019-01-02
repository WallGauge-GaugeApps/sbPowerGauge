#!/bin/bash
# To make this file executable follow these steps https://stackoverflow.com/questions/21691202/how-to-create-file-execute-mode-permissions-in-git-on-windows
echo "NPM post install shell that installs this app as service starts now..."
echo "copy ./sbPowerGauge.service /etc/systemd/system"
sudo cp ./postInstall/sbPowerGauge.service /etc/systemd/system
echo "systemctl enable sbPowerGauge.service"
sudo systemctl enable sbPowerGauge.service
echo "systemctl start sbPowerGauge.service"
sudo systemctl start sbPowerGauge.service
echo "systemctl status sbPowerGauge.service"
sudo systemctl status sbPowerGauge.service
echo "NPM Post install shell is complete."