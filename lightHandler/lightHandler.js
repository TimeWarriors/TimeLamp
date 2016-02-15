'use strict';
let config = require('./config.json')
let http = require('http');

function LightHandler()
{

}
LightHandler.prototype.getHueLamps = function(){
    return new Promise((resolve, reject) => {
        let options = {
            host: config.hueIp,
            path: "/api/"+config.userName+"/lights",
            method: 'GET'
        };
        http.get(options, function(res) {
          let chunks = [];
          res.on('data', function(chunk) {
            chunks.push(chunk);
          }).on('end', function() {
            let body = Buffer.concat(chunks);
            return resolve(body.toString());
          })
        }).on('error', function(e) {
          reject(message);
        });
    })
}

LightHandler.prototype.changeBrightness = function(lampId, brightness, secondsToChange)
{
    let bodyMessage = JSON.stringify({
        "bri": brightness,
        "transitiontime":secondsToChange*10 
    })
    let headers = {
        'Content-Type': 'application/json',
        'Content-Length': bodyMessage.length
    };
    let options = {
        host: config.hueIp,
        path: "/api/"+config.userName+"/lights/"+lampId+"/state",
        method: 'PUT',
        headers: headers
    };
    http.request(options).write(bodyMessage);
}

LightHandler.prototype.changeColor = function(lampId, r, g, b, secondsToChange){
    secondsToChange = secondsToChange || 1;
    //convert rgb to xy
    let X = r * 0.664511 + g * 0.154324 + b * 0.162028;
    let Y = r * 0.283881 + g * 0.668433 + b * 0.047685;
    let Z = r * 0.000088 + g * 0.072310 + b * 0.986039;
    let x = X / (X + Y + Z);
    let y = Y / (X + Y + Z);
    let bodyMessage = JSON.stringify({
        "xy": [x,y],
        "transitiontime":secondsToChange*10
    })
    let headers = {
        'Content-Type': 'application/json',
        'Content-Length': bodyMessage.length
    };
    let options = {
        host: config.hueIp,
        path: "/api/"+config.userName+"/lights/"+lampId+"/state",
        method: 'PUT',
        headers: headers
    };
    http.request(options).write(bodyMessage);
    
}
LightHandler.prototype.On = function(lampId, status){
    let bodyMessage = JSON.stringify({
        "on": status     
    })
    let headers = {
        'Content-Type': 'application/json',
        'Content-Length': bodyMessage.length
    };
    let options = {
        host: config.hueIp,
        path: "/api/"+config.userName+"/lights/"+lampId+"/state",
        method: 'PUT',
        headers: headers
    };
    http.request(options).write(bodyMessage);
}
//lampid, bool on, blinkrate ms(optional defaults to 1000)
LightHandler.prototype.toggleWarning = function(lampId, on, blinkrate){
    let self = this;
    blinkrate = blinkrate || 1000;
    let bri = 0;
    if(!on)
    {
        self.changeBrightness(lampId, 255)
    }
    else{
            return setInterval(function(){
            self.changeBrightness(lampId, bri, blinkrate/1000);
            if(bri == 0)
            {
                bri = 255;
            }
            else
            {
                bri = 0;
            }
        }, blinkrate);
    }
}

LightHandler.prototype.setWarning = function(lampId, blinkrate, seconds){
    let self = this;
    let interval = this.toggleWarning(lampId, true, blinkrate);
    setTimeout(function(){
        self.toggleWarning(lampId, false);
        clearInterval(interval);
    }, seconds*1000);
}

LightHandler.prototype.changeColorWithHue = function(lampId, hue, secondsToChange)
{
    let bodyMessage = JSON.stringify({
        "hue": hue,
        "transitiontime":secondsToChange*10
    })
    let headers = {
        'Content-Type': 'application/json',
        'Content-Length': bodyMessage.length
    };
    let options = {
        host: config.hueIp,
        path: "/api/"+config.userName+"/lights/"+lampId+"/state",
        method: 'PUT',
        headers: headers
    };
    http.request(options).write(bodyMessage);
}

module.exports = LightHandler;