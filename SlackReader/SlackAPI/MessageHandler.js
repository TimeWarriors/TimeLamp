'use strict';

const slackConfig = require('../slackConfig.json');
const lampConfig = require('../lampConfig.json');
const https = require('https');
const hashTags = require('../hashtags.json');
const LightHandler = require('../../lightHandler/lightHandler.js');
let lightHandler = new LightHandler();


const MessageHandler = class {
    constructor() {
       // this.lightHandler = new LightHandler();
        this.postedMessages = 0;
    }

    getMessages(channelID, lectureStartTime) {
        return new Promise((resolve, reject) => {

            let path =
                `/api/channels.history` +
                `?channel=${channelID}` +
                `&token=${slackConfig.token}` +
                `&pretty=1` +
                `&oldest=${lectureStartTime}`;

            // Test purpose.
            let timeWarriors =
                '/api/groups.history' +
                '?token=xoxp-3143650568-3152373211-20195086247-e680271034' +
                '&channel=G0JTV0Z2A&pretty=1' +
                '&oldest=1456732800';

            let options = {
                hostname: slackConfig.hostName,
                path: timeWarriors,
                method: 'GET'
            };

            let req = https.request(options, res => {
                let chunks = [];
                let messages = [];

                res.on('data', chunk => {
                    chunks.push(chunk);
                }).on('end', () => {
                    let body = Buffer.concat(chunks);
                    body = JSON.parse(body);

                    for (let message of body.messages) {
                        let messageProps = {
                            "user": message.user,
                            "text": message.text
                        };
                        messages.push(messageProps);
                    }
                    return resolve(messages);
                });
            }).on('error', error => {
                return reject(error);
            }).end();
        });
    }

    isNewMessagePosted(messages) {
        if (messages.length > this.postedMessages) {
            return true;
        }
        return false;
    }

    sortOutMessages(messages) {
        let sorted = this.sortOutNew(messages);
        sorted = this.sortOutHashTags(sorted);
        sorted = this.sortOutValidHashTags(sorted);
        return sorted;
    }

    sortOutNew(messages) {
        let diff = messages.length - this.postedMessages;
        messages.slice(0, messages.length - (diff + 1));
        return messages;
    }

    sortOutHashTags(messages) {
        let sortedMessages = [];

        for (let message of messages){
            if (message.text.includes('#')) {
                sortedMessages.push(message);
            }
        }
        return sortedMessages;
    }

    sortOutValidHashTags(messages) {
        let sortedMessages = [];

        for (let message of messages) {
            let messageProps = {
                "user": message.user,
                "text": message.text,
                "hashTags": []
            };

            for (let hashTag of hashTags) {
                let validHashTag = hashTag.hashTag;
                if (message.text.includes(validHashTag)) {
                    messageProps.hashTags.push(validHashTag);
                }
            }
            sortedMessages.push(messageProps);
        }
        console.log(sortedMessages);
        return sortedMessages;
    }

    handleMessages(messages) {
        for (let message of messages) {
            for (let hashTag of message.hashTags) {
                // TODO: Solve string dependency.
                let cases = {
                    '#!': this.streamProblem,
                    '#?': this.userHasQuestion,
                    '#I': this.postInfoToChannel
                };
                if (cases[hashTag]) {
                    cases[hashTag](message);
                }
            }
        }
    }

    streamProblem(message) {
        console.log(`${message.user} reports stream problem!`);
        // Test purpose.
        let lampID = '3';


        lightHandler.setWarning(
            lampID,
            lampConfig.blinkRate,
            lampConfig.time,
            lampConfig.warningColor
        );

    }

    userHasQuestion(message) {
        console.log(`${message.userhas} has a question!`);
        // Test purpose.
        let lampID = '2';


        lightHandler.setWarning(
            lampID,
            lampConfig.blinkRate,
            lampConfig.time,
            lampConfig.questionColor
        );

        // TODO: Post message to screen.
    }

    postInfoToChannel() {
        // Test purpose.
        let timeWarriors = '/api/chat.postMessage?token=xoxp-3143650568-3152373211-20195086247-e680271034&channel=G0JTV0Z2A&text=Vadvilldu&username=Steeve';

        let options = {
            hostname: slackConfig.hostName,
            path: timeWarriors,
            method: 'POST'
        };

        let req = https.request(options, res => {
            console.log(res.statusCode);
            console.log(res.statusMessage);
        }).on('error', error => {
            console.log(error);
        }).end();

    }
};

module.exports = MessageHandler;