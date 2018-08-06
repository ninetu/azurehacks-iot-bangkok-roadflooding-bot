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
// test sensor.id = cf68cf60ea6879a161d03c2ab5161ef5 with floodLevel = 3
node sensors/floodSensor.js cf68cf60ea6879a161d03c2ab5161ef5 3

// test sensor.id = cf68cf60ea6879a161d03c2ab5161ef5 with floodLevel = 3
node sensors/floodSensor.js cf68cf60ea6879a161d03c2ab5161ef5 0
```

### User ###

* User subscribe to LINE Bot
* User send command to LINE bot
- list : list all roads (only first 20 records are returned)
- subscribe [road_name] : to subscribe [road_name] for receiving alert when water level is changed (at this moment, allow only 1)
- unsubscribe : to unsubscribe from all
- [road_name] : to search for [road_name]


### Power BI ###

* Power BI is connected to CosmosDB
* It then visualize road flooding data on map

