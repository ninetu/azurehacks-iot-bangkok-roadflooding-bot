# Bangkok Road Flooding Bot #

## How it works? ##

Please follow steps below to test

### 1. User ###

* Scan QR to add LINE Bot

![LineQR](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/lineqr.png "LineQR")

* After add, send message to LINE bot

`
subscribe รัชดา
`

More available commands

Command| Example | Description
--- | --- | ---
list | list | List first 20 roads
subscribe [road-name] | subscribe รัชดา     | Subscribe and receive notification when flooding level on [road-name] is changed
unsubscribe | unsubscribe | Unsubscribe from all
[road-name] | รัชดา | Search for specific [road-name]


### 2. Sensor ###

* The project get road flooding water level data from IoT sensors
* Data is sent to Azure IoT-Hub
* Then trigger Azure Functions to store data into CosmosDB

```javascript
npm install
```

```
// To test send floodLevel=3 for sensor.id = cf68cf60ea6879a161d03c2ab5161ef5 (รัชดา)
// After run command below, you will receive LINE notification indicate that floodLevel for "รัชดา" is change from 0-->3

node sensors/floodSensor.js cf68cf60ea6879a161d03c2ab5161ef5 3


// To test send floodLevel=0 for sensor.id = cf68cf60ea6879a161d03c2ab5161ef5 (รัชดา)
// After run command below, you will receive LINE notification indicate that floodLevel for "รัชดา" is change from 3-->0

node sensors/floodSensor.js cf68cf60ea6879a161d03c2ab5161ef5 0
```


### Power BI ###

* Power BI is connected to CosmosDB
* Then visualize road flooding data on map

![PowerBI](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/powerbi.png "Power BI")
