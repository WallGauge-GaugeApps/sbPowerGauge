#!/bin/bash
echo "NPM Post install shell is running..."
echo "copy ./sbPowerGauge.service /etc/systemd/system"
cp ./sbPowerGauge.service /etc/systemd/system
echo "systemctl enable sbPowerGauge.service"
sudo systemctl enable sbPowerGauge.service
echo "systemctl start sbPowerGauge.service"
sudo systemctl start sbPowerGauge.service
echo "systemctl status sbPowerGauge.service"
sudo systemctl status sbPowerGauge.service
echo "NPM Post install shell is complete."