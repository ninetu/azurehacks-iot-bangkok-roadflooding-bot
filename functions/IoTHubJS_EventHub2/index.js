const request = require("request");
const querystring = require("querystring");

const config = {
  channelAccessToken:
    "UFFog1yQwPQ+HJcwCedLfCCAO3FZkhpuaEnFgOAtelWzB3sRCPrzEdXBHgnvXb3fWMg15aH1RJEs884hDEdVJAKfL+naSlPtCnUO4JiGXFJB0mL21F4r64ph0D8ft1+piUWTMw9cT1rg7/tJiOjIVAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "beb3924763c47d56df07007c621d99ed",
};

function doPush(output, context) {
  context.log(output);
  let options = {
    uri: "https://api.line.me/v2/bot/message/push",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + config.channelAccessToken,
    },
    body: JSON.stringify(output),
  };
  request(options, function(error, response, body) {
    context.log("request result");
    context.log(body);
    // return cb();
  });
}

module.exports = function(context, IoTHubMessages) {
  // read old data
  /*
  let inputLocation = {};
  if (context.bindings.inputLocation) {
    for (let i = 0; i < context.bindings.inputLocation.length; i++) {
      let _id = context.bindings.inputLocation[i].id;
      inputLocation[_id] = context.bindings.inputLocation[i];
    }
  }
  */

  // let inputUser = {};
  let subscribeList = {};
  if (context.bindings.inputUser) {
    for (let i = 0; i < context.bindings.inputUser.length; i++) {
      if (
        context.bindings.inputUser[i].subscribe !== undefined &&
        context.bindings.inputUser[i].subscribe !== ""
      ) {
        let sMsg = context.bindings.inputUser[i].subscribe;
        if (subscribeList[sMsg] === undefined) {
          subscribeList[sMsg] = [];
        }
        let _user = context.bindings.inputUser[i];
        subscribeList[sMsg].push(_user);
        // inputUser[_id] = context.bindings.inputUser[i];
      }
    }
  }

  // context.log(subscribeList);

  // context.log(`JavaScript eventhub trigger function called for message array: ${IoTHubMessages}`);
  let msgs = [];
  let i = 1;
  resultArray = [];
  outputUserArray = [];
  IoTHubMessages.forEach((message) => {
    let _item = {
      id: message.id,
      label: message.label,
      floodLevel: message.floodLevel,
      status: message.status,
      latlng: message.latlng,
    };

    for (let sub in subscribeList) {
      // match sub
      if (message.label.includes(sub) || sub.includes(message.label)) {
        let alertList = subscribeList[sub];
        context.log("alertList");
        context.log(alertList);
        for (let k = 0; k < alertList.length; k++) {
          let _user = alertList[k];
          if (_user.alert === undefined) {
            _user.alert = 0;
          }

          let oldValue = _user.alert;
          context.log("compare");
          context.log(_item.floodLevel);
          context.log(_user.alert);
          if (_user.alert !== _item.floodLevel) {
            _user.alert = _item.floodLevel;

            // send push to mobile if floodlevel change for subscriber
            let output = {
              to: _user.id, // fill-in your uid
              messages: [
                {
                  type: "text",
                  text:
                    "Flood Alert:\n" +
                    message.label +
                    "\nChanged " +
                    oldValue.toString() +
                    " cm --> " +
                    _item.floodLevel.toString() +
                    " cm",
                  quickReply: {
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
                  },
                },
              ],
            };
            doPush(output, context);
          }
          outputUserArray.push(_user);
        }
      }
    }
    /*
    if (inputLocation[_item.id] === undefined) {
      _item.pushed = 0;
    } else {
      _item.pushed = inputLocation[_item.id].pushed;
    }
    */

    resultArray.push(_item);
    /*
    context.bindings.outputLocation = {
      id: message.id,
      label: message.label,
      floodLevel: message.floodLevel,
      status: message.status,
      latlng: message.latlng,
    };
    */
  });
  context.bindings.outputLocation = resultArray;
  context.bindings.outputUser = outputUserArray;
  // context.log(outputUserArray);

  // doPush(output, context);

  context.done();
};
