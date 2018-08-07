# Bangkok Road Flooding Bot #

![Diagram](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/diagram.png "Diagram")

## Inspiration ##

Road flooding is a very classic problem in Bangkok. The road can turns to canel in 15 minutes of heavy rain. And people always ran to that area and get stucked for many hours with no way out.

## What it does ##

I use IoT sensor to monitor flooding level along the road. People can access the data using LINE messenger, or subscribe on specific road. When road flooding occurs, PUSH notification will be sent to subscribers allow them to avoid that area (then they may find something to do instead of go out and stuck on the road)

## How I built it ##

Azure IoT Hub / Azure Functions / CosmosDB / PowerBI / Nodejs

* IoT sensor send data to Azure IoT Hub
* Azure IoT Hub trigs Azure Functions to 2.1 Store data into CosmosDB 2.2. Send notificaiton to LINE subscribers
* LINE messenger connects to Azure Functions (which acts as serverless bot) over HTTPS
* HTTPs trigs Azure Functions to process message from LINE users and reply back
* PowerBI connects to CosmosDB and then Visualize floodingLevel on map in real time

## How to try it? ##

Follow steps below to test

### 1. User ###

* Download LINE messenger
* Scan QR Code below to add LINE Bot

![LineQR](https://github.com/ninetu/azurehacks-iot-bangkok-roadflooding-bot/raw/master/assets/line-qr.png "LineQR")

* After add, send message to LINE bot

`
list
รัชดา
subscribe รัชดา
`

Command| Example | Description
--- | --- | ---
[road-name] | รัชดา | Search for specific [road-name]
list | list | List first 20 roads
subscribe [road-name] | subscribe รัชดา     | Subscribe and receive notification on floodLevel of [road-name] is changed
unsubscribe | unsubscribe | Unsubscribe from all
help | help| List of commands

* After subscribed "รัชดา". You may send floodLevel on sensor-id (cf68cf60ea6879a161d03c2ab5161ef5) to receive notification.

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
