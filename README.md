# Bangkok Road Flooding Bot #

![Diagram](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/diagram.png "Diagram")

## How it works? ##

Please follow steps below to test

### 1. User ###

* Download LINE messenger
* Scan QR Code below to add LINE Bot

![LineQR](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/line-qr.png "LineQR")

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

[![LineDemo](http://img.youtube.com/vi/ZOic6ufZcuc/0.jpg)](https://youtu.be/ZOic6ufZcuc)


### 2. Sensor ###

* The project get road flooding water level data from IoT sensors
* Data is sent to Azure IoT-Hub
* Then trigger Azure Functions to store data into CosmosDB

See [List of sensors](SENSORS.md)


```javascript
npm install
```

```
// Change to sensors directory
cd sensors

// Test send floodLevel=3 for sensor.id = cf68cf60ea6879a161d03c2ab5161ef5 (ถ.รัชดาฯ หน้าโรบินสัน)
// After run command below, you will receive LINE notification indicate that floodLevel for "รัชดา" is change from 0-->3

node floodSensor.js cf68cf60ea6879a161d03c2ab5161ef5 3


// Test send floodLevel=0 for sensor.id = cf68cf60ea6879a161d03c2ab5161ef5 (ถ.รัชดาฯ หน้าโรบินสัน)
// After run command below, you will receive LINE notification indicate that floodLevel for "รัชดา" is change from 3-->0

node floodSensor.js cf68cf60ea6879a161d03c2ab5161ef5 0
```

![Cmd](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/cmd.png "Cmd")



### Power BI ###

* Power BI is connected to CosmosDB
* Then visualize road flooding data on map
* Download PowerBI and open file powerbi/BangkokMap.pbix to see the flooding level on map

![PowerBI](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/powerbi.png "Power BI")
