# Bangkok Road Flooding Bot #

## How it works? ##

### Sensor Data ###

* The project get road flooding water level data from IoT sensors
* Data is sent to Azure IoT-Hub
* Then trigger Azure Functions to store data into CosmosDB

```javascript
npm install
```

```
// test sensor.id = cf68cf60ea6879a161d03c2ab5161ef5 (รัชดา) with floodLevel = 3
node sensors/floodSensor.js cf68cf60ea6879a161d03c2ab5161ef5 3

// test sensor.id = cf68cf60ea6879a161d03c2ab5161ef5 (รัชดา)  with floodLevel = 3
node sensors/floodSensor.js cf68cf60ea6879a161d03c2ab5161ef5 0
```


### User ###

* Scan QR to add LINE Bot

![LineQR](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/powerbi.png "LineQR")

* User send command to LINE bot

Command| Example | Description
--- | --- | ---
list | list | List first 20 roads
subscribe [road-name] | subscribe รัชดา     | Subscribe and receive notification when flooding level on [road-name] is changed
unsubscribe | unsubscribe | Unsubscribe from all
[road-name] | รัชดา | Search for specific [road-name]


### Power BI ###

* Power BI is connected to CosmosDB
* Then visualize road flooding data on map

![PowerBI](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/powerbi.png "Power BI")
