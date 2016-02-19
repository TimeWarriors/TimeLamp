'use strict';

let config = require('../config.json');
let https = require('https');


function SlackReader() {};

SlackReader.prototype.convertStartTimeToMilliseconds = function(startTime) {
    var today = new Date();
    today.setHours(startTime.substring(0, 2));
    today.setMinutes(startTime.substring(3, 5));
    today.setSeconds(0);
    startTime = +today; // '+' Converts to milliseconds.

    return startTime;
};

module.exports = SlackReader;