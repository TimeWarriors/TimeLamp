'use strict';
let config = require('./config.json')
let http = require('http');

function LightHandler() {

}
LightHandler.prototype.getHueLamps = function () {
    return new Promise((resolve, reject) => {
        let options = {
            host: config.hueIp,
            path: "/api/" + config.userName + "/lights",
            method: 'GET'
        };
        http.get(options, function (res) {
            let chunks = [];
            res.on('data', function (chunk) {
                chunks.push(chunk);
            }).on('end', function () {
                let body = Buffer.concat(chunks);
                return resolve(body.toString());
            })
        }).on('error', function (e) {
            reject(message);
        });
    })
}
LightHandler.prototype.getHueLampById = function (id) {
    return new Promise((resolve, reject) => {
        let options = {
            host: config.hueIp,
            path: "/api/" + config.userName + "/lights/" + id,
            method: 'GET'
        };
        http.get(options, function (res) {
            let chunks = [];
            res.on('data', function (chunk) {
                chunks.push(chunk);
            }).on('end', function () {
                let body = Buffer.concat(chunks);
                return resolve(body.toString());
            })
        }).on('error', function (e) {
            reject(message);
        });
    })
}

LightHandler.prototype.changeBrightness = function (lampId, brightness, secondsToChange) {
    return new Promise((resolve, reject) => {
        let bodyMessage = JSON.stringify({
            "bri": brightness,
            "transitiontime": secondsToChange * 10
        })
        let headers = {
            'Content-Type': 'application/json',
            'Content-Length': bodyMessage.length
        };
        let options = {
            host: config.hueIp,
            path: "/api/" + config.userName + "/lights/" + lampId + "/state",
            method: 'PUT',
            headers: headers
        };
        let req = http.request(options, (res) => {
            let responseData = [];
            res.on('data', (chunk) => {
                responseData.push(chunk);
            })
            res.on('end', () => {
                return resolve(Buffer.concat(responseData).toString())
            })
        })
        req.on('error', (e) => {
            reject("request failed with message: " + e.message);
        })
        req.write(bodyMessage);
        req.end();
    })
}

LightHandler.prototype.changeSaturation = function (lampId, saturation, secondsToChange) {
    return new Promise((resolve, reject) => {
        let bodyMessage = JSON.stringify({
            "sat": saturation,
            "transitiontime": secondsToChange * 10
        })
        let headers = {
            'Content-Type': 'application/json',
            'Content-Length': bodyMessage.length
        };
        let options = {
            host: config.hueIp,
            path: "/api/" + config.userName + "/lights/" + lampId + "/state",
            method: 'PUT',
            headers: headers
        };
        let req = http.request(options, (res) => {
            let responseData = [];
            res.on('data', (chunk) => {
                responseData.push(chunk);
            })
            res.on('end', () => {
                return resolve(Buffer.concat(responseData).toString())
            })
        })
        req.on('error', (e) => {
            reject("request failed with message: " + e.message);
        })
        req.write(bodyMessage);
        req.end();
    })
}

LightHandler.prototype.On = function (lampId, status) {
        return new Promise((resolve, reject) => {
            let bodyMessage = JSON.stringify({
                "on": status
            })
            let headers = {
                'Content-Type': 'application/json',
                'Content-Length': bodyMessage.length
            };
            let options = {
                host: config.hueIp,
                path: "/api/" + config.userName + "/lights/" + lampId + "/state",
                method: 'PUT',
                headers: headers
            };
            let req = http.request(options, (res) => {
                let responseData = [];
                res.on('data', (chunk) => {
                    responseData.push(chunk);
                })
                res.on('end', () => {
                    return resolve(Buffer.concat(responseData).toString())
                })
            })
            req.on('error', (e) => {
                reject("request failed with message: " + e.message);
            })
            req.write(bodyMessage);
            req.end();

        })
    }
    //lampid, bool on, blinkrate ms(optional defaults to 1000)
LightHandler.prototype.toggleWarning = function (lampId, on, blinkrate) {
    let self = this;
    blinkrate = blinkrate || 1000;
    let bri = 0;
    if (!on) {
        self.changeBrightness(lampId, 255)
    } else {
        return setInterval(function () {
            self.changeBrightness(lampId, bri, blinkrate / 1000);
            if (bri == 0) {
                bri = 255;
            } else {
                bri = 0;
            }
        }, blinkrate);
    }
}

LightHandler.prototype.setWarning = function (lampId, blinkrate, seconds, hue) {
    return new Promise((resolve, reject) => {
        let self = this;
        let newColor = hue;
        let id = lampId;
        let rate = blinkrate;
        this.getHueLampById(lampId).then(function (res) {
            let object = JSON.parse(res);
            let initialColor = object.state.hue;
            self.changeColorWithHue(id, newColor, 0);
            let interval = self.toggleWarning(id, true, rate);
            setTimeout(function () {
                self.changeColorWithHue(id, initialColor, 0);
                self.toggleWarning(id, false);
                clearInterval(interval);
                return resolve();
            }, seconds * 1000);
        })
    })
}

LightHandler.prototype.changeColorWithHue = function (lampId, hue, secondsToChange) {
    return new Promise((resolve, reject) => {
        let bodyMessage = JSON.stringify({
            "hue": hue,
            "transitiontime": secondsToChange * 10
        })
        let headers = {
            'Content-Type': 'application/json',
            'Content-Length': bodyMessage.length
        };
        let options = {
            host: config.hueIp,
            path: "/api/" + config.userName + "/lights/" + lampId + "/state",
            method: 'PUT',
            headers: headers
        };
        let req = http.request(options, (res) => {
            let responseData = [];
            res.on('data', (chunk) => {
                responseData.push(chunk);
            })
            res.on('end', () => {
                return resolve(Buffer.concat(responseData).toString())
            })
        })
        req.on('error', (e) => {
            reject("request failed with message: " + e.message);
        })
        req.write(bodyMessage);
        req.end();
    })
}

module.exports = LightHandler;