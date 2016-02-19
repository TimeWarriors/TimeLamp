'use strict';

let config = require('../config.json');
let https = require('https');
let hashTags = require('../hashtags.json');


function SlackMessages() {};

SlackMessages.prototype.getChatMessagesFromStartTime = function(channelID, lectureStartTime) {
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
            });
        }).on('error', e => {
            console.error('ERROR: ' + e);
            reject(e);
        }).end();
    });
};

SlackMessages.prototype.isNewMessagePosted = function(messages, postedMessages) {
    if (messages.length > postedMessages) {
        return true;
    }
    return false;
};

SlackMessages.prototype.getNewMessages = function(messages, postedMessages) {
    var diff = messages.length - postedMessages;
    messages.slice(0, messages.length - (diff + 1));
    return messages;
};

SlackMessages.prototype.searchForHashTags = function(newMessages) {
    // Test purpose.
    newMessages.push('#! Streamen funkar inte');
    newMessages.push('#? Jag har en fråga, och #! streamen funkar inte!');

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
            for (var j = 0; j < hashTags.length; j++) {
                var validHashTag = hashTags[j].hashTag;
                if (newMessages[i].indexOf(validHashTag) > -1) {
                    message.hashTags.push(validHashTag);
                }
            }
            messages.push(message);
        }
    }
    if (messages.length > 0) return messages;
};

SlackMessages.prototype.handleMessages = function(messages) {
    for (var i = 0; i < messages.length; i++) {
        for (var j = 0; j < messages[i].hashTags.length; j++) {

            var hashTag = messages[i].hashTags[j];

            switch (0) {
                case hashTag.indexOf('#!'):
                    // TODO: Init warning light...
                    console.log('Problem with stream!');
                    //lightHandler.setWarning('43', 1000, 3);
                    break;
                case hashTag.indexOf('#?'):
                    // TODO: Send message to screen...
                    console.log('User has a question!');
                    break;
                case hashTag.indexOf('#I'):
                    // TODO: Send info to user...
                    console.log('User wants info!');
                    break;
                default: break;
            }
        }
    }
};

module.exports = SlackMessages;