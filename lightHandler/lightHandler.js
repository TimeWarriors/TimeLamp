'use strict';
let config = require('./config.json')
let http = require('http');

function LightHandler() {

}
/**
 *get all lamps installed on the bridge
 * @returns {promise} [resolve = json object with all the information about the installed lamps]
 */
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
/**
 * gets lamp by specified id
 * @param   {string} id [id of lamp to get]
 * @returns {promise} [resolve = json object with all the information about the lamp]
 */
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
/**
 * Change the brightness of a specified lamp
 * @param   {string} lampId          [Id of the lamp]
 * @param   {int} brightness      [brightness (0-255)]
 * @param   {int} secondsToChange [transitiontime]
 * @returns {Promise} [with responsedata from the api]
 */
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
/**
 * Change the saturation of a specified lamp
 * @param   {string} lampId          [Id of the lamp]
 * @param   {int} saturation      [saturation(0-255)]
 * @param   {int} secondsToChange [transitiontime]
 * @returns {promise} [with responsedata from the api]
 */
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

/**
 * Turn a lamp on or off
 * @param   {string} lampId [id of lamp]
 * @param   {bool} status [true/false for on/off]
 * @returns {promise} [returns the responsedata from the api]
 */
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
/**
 * Toggle warningblink for specified lamp
 * @param   {string} lampId           [id of lamp]
 * @param   {bool} on               [true/false for on/off]
 * @param   {float} [blinkrate=1000] [rate(ms) the lamp should pulse/blink at]
 * @returns {interval} [returns interval that you can unset]
 */
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

/**
 * Warningblink for x seconds in y color blinking at z rate.
 * @param   {string} lampId    [id of lamp]
 * @param   {float} blinkrate [rate(ms) the lamp should pulse/blink at]
 * @param   {float} seconds   [amount of seconds to blink/pulse]
 * @param   {int} hue       [the color it should blink/pulse(0-65535)]
 * @returns {promise} 
 */
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

/**
 * changes the color of the specified lamp using hue.
 * @param   {string} lampId          [id of lamp]
 * @param   {int} hue             [Color to change the lamp to (0-65535)]
 * @param   {float} secondsToChange [[Description]]
 * @returns {promise} [returns the responsedata from the api]
 */
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