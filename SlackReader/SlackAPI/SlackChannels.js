'use strict';

let config = require('../config.json');
let https = require('https');


function SlackChannels() {};

/* Will only need to call this once. */
SlackChannels.prototype.getAllChannels = function() {
    return new Promise((resolve, reject) => {

        let options = {
            hostname: config.hostName,
            path: '/api/channels.list?token=' + config.token + '&pretty=1',
            method: 'GET'
        };

        var req = https.request(options, res => {
            let chunks = [];

            res.on('data', chunk => {
                chunks.push(chunk);
            }).on('end', () => {
                let body = Buffer.concat(chunks);
                return resolve(JSON.parse(body));
            });
        }).on('error', e => {
            console.error('ERROR: ' + e);
            reject(e);
        }).end();
    });
};

/* Will only need to call this once. */
SlackChannels.prototype.pairDesiredChannelNamesWithIDs = function(channelsObject, channelNames) {
    var channels = channelsObject.channels;
    var channelNamesAndIDs = [];

    for (var i = 0; i < channelNames.length; i++) {
        for (var j = 0; j < channels.length; j++) {
            if (channels[j].name.indexOf(channelNames[i]) > -1) {
                var channel = {
                    "name": channelNames[i],
                    "id": channels[j].id
                };
                channelNamesAndIDs.push(channel);
            }
        }
    }
    return channelNamesAndIDs;
};

/* Get channel ID to be able to access its chat */
SlackChannels.prototype.getChannelID = function(channels, channelName) {
    var channelID = '';
    for (var i = 0; i < channels.length; i++) {
        if (channelName.indexOf(channels[i].name) > -1) {
            channelID = channels[i].id;
        }
    }
    if (channelID) return channelID;
};

module.exports = SlackChannels;