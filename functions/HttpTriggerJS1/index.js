const request = require("request");
const querystring = require("querystring");
// You must include a context, but other arguments are optional
const config = {
  channelAccessToken:
    "UFFog1yQwPQ+HJcwCedLfCCAO3FZkhpuaEnFgOAtelWzB3sRCPrzEdXBHgnvXb3fWMg15aH1RJEs884hDEdVJAKfL+naSlPtCnUO4JiGXFJB0mL21F4r64ph0D8ft1+piUWTMw9cT1rg7/tJiOjIVAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "beb3924763c47d56df07007c621d99ed",
};

// const myBluetoothMac = "c80f10a410e1";

function dopost(output, context, cb) {
  var options = {
    uri: "https://api.line.me/v2/bot/message/reply",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + config.channelAccessToken,
    },
    body: JSON.stringify(output),
  };
  request(options, function(error, response, body) {
    context.log(body);
    return cb();
  });
}

module.exports = function(context) {
  var input = context.req.body;
  let outputText = input.events[0].message.text;
  let userId = input.events[0].source.userId;
  let quickReply = {};

  // find user intent
  if (
    input &&
    input.events &&
    input.events[0] &&
    input.events[0].type === "message"
  ) {
    let intent = "";
    let inputText = input.events[0].message.text;
    let inputText2 = inputText.toLowerCase();

    let inputUser = {};

    context.log("user");
    context.log(context.bindings.inputUser);

    inputUser = {
      id: userId,
      text: "",
      intent: "",
    };
    if (context.bindings.inputUser) {
      for (let i = 0; i < context.bindings.inputUser.length; i++) {
        if (context.bindings.inputUser[i].id === userId) {
          inputUser = context.bindings.inputUser[i];
          break;
        }
      }
    }
    inputUser.text = inputText;

    // context.log(inputText2.substring(0, 9));
    if (inputText2 === "help") {
      outputText = "Type:";
      outputText += "\n- alert : List of roads that floodLevel > 0";
      outputText += "\n- list  : List of roads";
      outputText += "\n- [road name] : Search for road by name";
      outputText += "\n- subscribe [road-name] : Subscribe that road"
      outputText += "\n- unsubscribe : Unsubscribe all"
    } else if (inputText2 === "list") {
      let documents = context.bindings.inputLocation;
      let rMsg = "Showing first 20 / " + documents.length.toString() + " roads";
      for (var i = 0; i < documents.length; i++) {
        var document = documents[i];
        if (i < 20) {
          rMsg += "\n" + document.label;
        }
      }
      outputText = rMsg;
    } else if (inputText2 === 'alert') {
      // search inputLocation.label
      let numFound = 0;
      let resLocation = [];
      let documents = context.bindings.inputLocation;
      for (var i = 0; i < documents.length; i++) {
        var document = documents[i];
        if (document.floodLevel > 0) {
          if (document.status !== "Unknown") {
            resLocation.push({
              id: document.id,
              label: document.label.trim(),
              status: document.status,
              floodLevel: document.floodLevel,
              latlng: document.latlng,
            });
            numFound++;
          }
        }
      }

      if (numFound > 0) {
        let rMsg = "";
        rMsg += 'Alert! ' + resLocation.length.toString() + " roads";
        for (let i = 0; i < resLocation.length; i++) {
          let _icon = "";
          let _level = 0;
          rMsg += "\n";
          if (resLocation[i].status === "Normal") {
            if (resLocation[i].floodLevel > 0) {
              _icon = "⚠️";
              _level = resLocation[i].floodLevel;
            } else {
              _icon = "✅";
            }
          } else {
            _icon = "⛔️";
            _level = resLocation[i].floodLevel;
          }
          rMsg += _icon + " " + resLocation[i].label;
          rMsg += " (" + _level.toString() + " cm)";
        }
        outputText = rMsg;
      } else {
        outputText = "No flooding in all areas.";
      }
    } else if (inputText2 === "unsubscribe" || inputText2 === "unsub") {
      inputUser.subscribe = "";
      outputText = "Unsubscribe successful";
    } else if (inputText2.substring(0, 9) === "subscribe") {
      // context.log(inputUser);
      if (inputUser.subscribe !== undefined && inputUser.subscribe !== "") {
        outputText = "Change subscription to " + inputText.substring(10) + ".";
      } else {
        outputText = "Subscribe \"" + inputText.substring(10) + "\" success.";
        outputText+= "\nYou will receive notify when floodLevel is changed";
      }
      inputUser.subscribe = inputText.substring(10);
      
      quickReply = {
        items: [
          {
            type: "action",
            action: {
              type: "message",
              label: "Unsubscribe",
              text: "Unsubscribe",
            },
          },
        ],
      };
    } else {
      // search inputLocation.label
      let numFound = 0;
      let resLocation = [];
      let documents = context.bindings.inputLocation;
      for (var i = 0; i < documents.length; i++) {
        var document = documents[i];
        if (
          inputText2.includes(document.label) ||
          document.label.includes(inputText2) ||
          inputText2 === document.label
        ) {
          if (document.status !== "Unknown") {
            resLocation.push({
              id: document.id,
              label: document.label.trim(),
              status: document.status,
              floodLevel: document.floodLevel,
              latlng: document.latlng,
            });
            numFound++;
          }
        }
      }

      if (numFound > 0) {
        let rMsg = "";
        rMsg += 'Found: ' + inputText + " in " + resLocation.length.toString() + " areas";
        for (let i = 0; i < resLocation.length; i++) {
          let _icon = "";
          let _level = 0;
          rMsg += "\n";
          if (resLocation[i].status === "Normal") {
            if (resLocation[i].floodLevel > 0) {
              _icon = "⚠️";
              _level = resLocation[i].floodLevel;
            } else {
              _icon = "✅";
            }
          } else {
            _icon = "⛔️";
            _level = resLocation[i].floodLevel;
          }
          rMsg += _icon + " " + resLocation[i].label;
          rMsg += " (" + _level.toString() + " cm)";
        }
        outputText = rMsg;
        if (resLocation.length > 0) {
          quickReply = {
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "Subscribe " + inputText,
                  text: "Subscribe " + inputText,
                },
              },
            ],
          };
        }
      } else {
        outputText = "Not found: " + inputText;
        outputText += "\n" + "Type 'help' to see what I can do";
      }
    }
    // update last message from user
    inputUser.intent = intent;
    context.bindings.outputUser = inputUser;
  }
  // end

  var output = {
    replyToken: input.events[0].replyToken,
    messages: [
      {
        type: "text",
        text: outputText,
      },
    ],
  };

  if (quickReply && quickReply.items) {
    output.messages[0].quickReply = quickReply;
  }

  // context.log(input.events[0]);
  context.log(output);
  dopost(output, context, function() {
    var res = {
      status: 200,
      body: "OK",
    };
    context.done(null, res);
  });
};

// or you can include additional inputs in your arguments
/*
module.exports = function(context, myTrigger, myInput, myOtherInput) {
  // function logic goes here :)
};
*/
