'use strict';
let Blink1 = require('node-blink1');
let config = require('./config.json')
let http = require('http');
let blink1;
let interval;

function LightHandler()
{

}
LightHandler.prototype.getHueLamps = function(){ //returnerar ingenting just nu
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
        console.log('BODY: ' + body);
      })
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
}
LightHandler.prototype.changeBrightness = function(lampId, brightness)
{
    let bodyMessage = JSON.stringify({
        "bri": brightness
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

LightHandler.prototype.changeColor = function(lampId, r, g, b, millisecondsToChange){
    millisecondsToChange = millisecondsToChange || 1000;
    let blinkDevices = Blink1.devices();
    if(blinkDevices.indexOf(lampId) != -1)
    {
        blink1 = new Blink1(lampId);
        blink1.fadeToRGB(millisecondsToChange, r, g, b);
        blink1.close();
    }
    else //här ska den köra med en else if mot philips hue istället
    {
        //convert rgb to xy
        let X = r * 0.664511 + g * 0.154324 + b * 0.162028;
        let Y = r * 0.283881 + g * 0.668433 + b * 0.047685;
        let Z = r * 0.000088 + g * 0.072310 + b * 0.986039;
        let x = X / (X + Y + Z);
        let y = Y / (X + Y + Z);
        let bodyMessage = JSON.stringify({
            "xy": [x,y]
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
}
LightHandler.prototype.turnOff = function(lampId, status){
    let blinkDevices = Blink1.devices();
    if(blinkDevices.indexOf(lampId) != -1)
    {
        blink1 = new Blink1(lampId);
        blink1.off()
        blink1.close();
    }
    else{
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
    //här ska den köra med en else if mot philips hue istället
}
//lampid, bool on, blinkrate ms(optional defaults to 1000)
LightHandler.prototype.toggleWarning = function(lampId, on, blinkrate){
    let self = this;
    blinkrate = blinkrate || 1000;
    let bri = 0;
    if(!on)
    {
        clearInterval(interval);
        self.changeBrightness(lampId, 255)
    }
    else{
            interval = setInterval(function(){
            self.changeBrightness(lampId, bri);
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

module.exports = LightHandler;