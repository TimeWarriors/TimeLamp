'use strict';

let config = require('../config.json');
let https = require('https');
let hashTags = require('../hashtags.json');


function SlackReader() {};

/* Will only need to call this once. */
SlackReader.prototype.getAllChannels = function() {
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
SlackReader.prototype.getChannelNamesAndIDs = function(channelsObject, channelNames) {
    var channels = channelsObject.channels;
    var channelNamesAndIDs = [];

    for (var i = 0; i < channelNames.length; i++) {
        for (var j = 0; j < channels.length; j++) {
            if (channels[j].name.match(channelNames[i])) {
                var channel = {
                    "name": channelNames[i],
                    "id": channels[j].id
                };
                channelNamesAndIDs.push(channel);
            }
        }
    }
    //console.log(channelNamesAndIDs);
    return channelNamesAndIDs;
};

/* Get channel ID to be able to access its chat */
SlackReader.prototype.getChannelID = function(channels, channelName) {
    var channelID = '';
    for (var i = 0; i < channels.length; i++) {
        if (channelName.match(channels[i].name)) {
            channelID = channels[i].id;
        }
    }

    if (channelID) return channelID;
};

SlackReader.prototype.getChatMessagesFromStartTime = function(channelID, lectureStartTime) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: config.hostName,
            path: '/api/channels.history?channel=' + channelID +
                '&token=' + config.token + '&pretty=1&oldest=' + lectureStartTime,
            method: 'GET'
        };

        var req = https.request(options, res => {
            let chunks = [];
            let messages = [];

            res.on('data', chunk => {
                chunks.push(chunk);
            }).on('end', () => {
                let body = Buffer.concat(chunks);
                body = JSON.parse(body);

                for (var i = 0; i < body.messages.length; i++) {
                    messages.push(body.messages[i].text);
                }
                return resolve(messages);
                //return resolve(JSON.parse(body));
            });
        }).on('error', e => {
            console.error('ERROR: ' + e);
            reject(e);
        }).end();
    });
};

SlackReader.prototype.isNewMessagePosted = function(messages, postedMessages) {
    if (messages.length > postedMessages) {
        return true;
    }
    return false;
};

SlackReader.prototype.getNewMessages = function(messages, postedMessages) {
    var diff = messages.length - postedMessages;
    messages.slice(0, messages.length - (diff + 1));

    return messages;
};

SlackReader.prototype.searchForHashTags = function(newMessages) {
    // Test purpose.
    //newMessages.push('#! Streamen funkar inte');
    //newMessages.push('#? Jag har en fråga och streamen funkar inte! #!');

    var messages = [];

    for (var i = 0; i < newMessages.length; i++) {
        // First check if the new message even contains a hashtag.
        if (newMessages[i].indexOf('#') > -1) {
            var message = {
                "text": newMessages[i],
                "hashTags": []
            };
            /* Iterate through each valid hashtag
               and see if message contains any of them. */
            for (var j = 0; j < hashTags.hashTags.length; j++) {
                var validHashTag = hashTags.hashTags[j].hashTag;
                if (newMessages[i].indexOf(validHashTag) > -1) {
                    message.hashTags.push(validHashTag);
                }
            }

            messages.push(message);
        }
    }

    if (messages.length > 0) {
        console.log('At least one new message contains one or more hashtags!');
        return messages;
    } else {
        console.log('None of the new messages contains any hashtags!');
    }
};

module.exports = SlackReader;