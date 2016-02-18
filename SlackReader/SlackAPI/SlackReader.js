'use strict';

let config = require('../config.json');
let https = require('https');
let hashTags = require('../hashtags.json');
//let lightHandler = require('../../lightHandler/lightHandler.js');


function SlackReader() {};

SlackReader.prototype.convertStartTimeToMilliseconds = function(startTime) {
    var today = new Date();
    today.setHours(startTime.substring(0, 2));
    today.setMinutes(startTime.substring(2, 4));
    today.setSeconds(0);
    startTime = +today; // '+' Converts to milliseconds.

    return startTime;
};

module.exports = SlackReader;