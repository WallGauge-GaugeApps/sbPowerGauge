# SunnyBoy Power Gauge App

<figure> 
    <img align="left" width="100" height="100" src="./docs/wallGaugeLogSquared.png" > 
    <figcaption>Fig.1 - Trulli, Puglia, Italy.</figcaption>
</figure>

&#174;This WallGauge reads real-time solar production from a SMA Sunny WebBox via its REST API. The solar production value is then sent to a physical battery powered gauge for display.  The data is read from the Sunny WebBox every 60 seconds and sent to the WallGauge. You should get approximately one year battery life out of three AAA batteries.

## GDT Administrator notes

![pic](./docs/gdtAdminSS.png)

The above screen shot is from the WallGauge IOS App [gdtAdministrator](https://apps.apple.com/us/app/gdt-administrator/id1498115113) running on an iPad with this SunnyBoy Power Gauge App installed.

To configure the gauge app you must tap on the “SunnyBoy Web Box Address” list item and enter the IP address of your SunnyBoy WebBox.  In this screen shot the address is 10.50.0.50.

The Value shown at the top of the screen is the the current power being generated, total kilowatt hours for the day, and total kilowatt hours since the array was commissioned.

## Gauge Art

![pic](./docs/GaugePic.png)
![pic](./docs/GaugePicSide.png)
![pic](./docs/spin.gif)

## Notes

SMA has discontinued the SunnyBoy WebBox.  For more information [click here.](https://www.sma-sunny.com/en/questions-and-answers-on-discontinuation-of-the-sunny-webbox/)