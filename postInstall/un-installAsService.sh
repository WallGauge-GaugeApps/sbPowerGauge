#!/bin/bash
# To make this file executable follow these steps https://stackoverflow.com/questions/21691202/how-to-create-file-execute-mode-permissions-in-git-on-windows
echo "un-install services starts now..."
echo "systemctl stop sbPowerGauge.service"
sudo systemctl stop sbPowerGauge.service
echo "systemctl disable sbPowerGauge.service"
sudo systemctl disable sbPowerGauge.service
echo "rm /etc/systemd/system/sbPowerGauge.service"
sudo rm /etc/systemd/system/sbPowerGauge.service
echo "un-instal shell is complete."