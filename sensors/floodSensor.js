"use strict";
const config = require("./config.js");
const rp = require("request-promise");
const fs = require("fs");
var md5 = require("md5");
var args = process.argv.slice(2);
var overideSensorId = args[0]; // cf68cf60ea6879a161d03c2ab5161ef5 = รัชดา
var overideFloodLevel = args[1]; // 0
var useLiveData = true;

function refreshData() {
  if (!useLiveData) {
    res = JSON.parse(fs.readFileSync("./flood.json"));
    processFloodData(res);
  } else {
    /* this connect to the realtime data */
    let ts = Date.now().toString();
    var options = {
      uri: "http://app.nytu.net/azurehacks/data/flood.json?ts=" + ts,
      json: true,
    };

    rp(options)
      .then(function(res) {
        processFloodData(res);
      })
      .catch(function(err) {
        // API call failed...
      });
  }
}

function processFloodData(res) {
  if (res && res.dataSet && res.dataSet.length > 0) {
    for (let i = 0; i < res.dataSet.length; i++) {
      if (
        res.dataSet[i].location.coordinate.latitude &&
        res.dataSet[i].location.coordinate.longitude
      ) {
        let _label = res.dataSet[i].location.label;
        let sensor = {
          id: md5(_label),
          label: _label,
          floodLevel: res.dataSet[i].floodRoad.floodLevel,
          status: res.dataSet[i].floodRoad.status,
          latlng:
            res.dataSet[i].location.coordinate.latitude +
            "," +
            res.dataSet[i].location.coordinate.longitude,
        };
        if (overideSensorId && overideSensorId === sensor.id) {
          sensor.floodLevel = overideFloodLevel;
        }

        /* send only this sensor.id (to reduce azure cost)
        if (sensor.id === "cf68cf60ea6879a161d03c2ab5161ef5") {
          console.log(sensor);
          sendData(sensor);
        }
        */
        // or send everything
        sendData(sensor);
      }
    }
  }
}

// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var Protocol = require("azure-iot-device-mqtt").Mqtt;
// Uncomment one of these transports and then change it in fromConnectionString to test other transports
// var Protocol = require('azure-iot-device-amqp').AmqpWs;
// var Protocol = require('azure-iot-device-http').Http;
// var Protocol = require('azure-iot-device-amqp').Amqp;
// var Protocol = require('azure-iot-device-mqtt').MqttWs;
var Client = require("azure-iot-device").Client;
var Message = require("azure-iot-device").Message;

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
var connectionString = config.iotHub.connectionString;

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);

var connectCallback = function(err) {
  if (err) {
    console.error("Could not connect: " + err.message);
  } else {
    console.log("Client connected");
    client.on("message", function(msg) {
      // console.log("Id: " + msg.messageId + " Body: " + msg.data);
      // When using MQTT the following line is a no-op.
      client.complete(msg, printResultFor("completed"));
      // The AMQP and HTTP transports also have the notion of completing, rejecting or abandoning the message.
      // When completing a message, the service that sent the C2D message is notified that the message has been processed.
      // When rejecting a message, the service that sent the C2D message is notified that the message won't be processed by the device. the method to use is client.reject(msg, callback).
      // When abandoning the message, IoT Hub will immediately try to resend it. The method to use is client.abandon(msg, callback).
      // MQTT is simpler: it accepts the message by default, and doesn't support rejecting or abandoning a message.
    });

    // Create a message and send it to the IoT Hub every second
    client.on("error", function(err) {
      console.error(err.message);
    });

    client.on("disconnect", function() {
      clearInterval(sendInterval);
      client.removeAllListeners();
      client.open(connectCallback);
    });
  }
};

client.open(connectCallback);

function sendData(jsonData) {
  var data = JSON.stringify(jsonData);
  var message = new Message(data);
  message.properties.add(
    "statusAlert",
    jsonData.status === "Normal" ? "false" : "true"
  );
  // console.log("Sending message: " + message.getData());
  client.sendEvent(message, printResultFor("send"));
}

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + " error: " + err.toString());
    if (res) console.log(op + " status: " + res.constructor.name);
  };
}

/* MAIN */
refreshData();
setInterval(refreshData, 60000);
