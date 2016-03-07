'use strict';

const slackConfig = require('../slackConfig.json');
const lampConfig = require('../lampConfig.json');
const https = require('https');
const hashTags = require('../hashtags.json');
const channelConfig = require('../channels.json');
const LightHandler = require('../../lightHandler/lightHandler.js');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const usersFile = require('../users.json');


const MessageHandler = class {

    constructor() {
        this.lightHandler = new LightHandler();
        this.coolDownCounter = 0;
    }

    /**
     * Sort out all messages containing valid hashtags.
     *
     * @param message
     */
    handleMessage(message) {
        console.log(message);
        let msg = JSON.parse(message.utf8Data);

        if (msg.type === 'message' &&
            msg.hasOwnProperty('text') &&
            msg.text.includes('#')) {

            //if (this.isLectureLive(msg)) {
                msg = this.sortValidHashTags(msg);
                if (msg.hasOwnProperty('hashTags'))
                    this.handleValidHashTags(msg);
            //}
        }
    }

    /**
     * Verify if the lecture is live.
     *
     * @param message
     * @returns {boolean}
     */
    isLectureLive(message) {
        const messageTimeStamp = message.ts;
        let lectureStartTime;
        let lectureEndTime;

        for (let channel of channelConfig) {
            if (channel.id === message.channel) {
                if (message.hasOwnProperty('todayStartTime') &&
                    message.hasOwnProperty('todayEndTime')) {
                    lectureStartTime = channel.todayStartTime;
                    lectureEndTime = channel.todayEndTime;
                }
            }
        }

        if (lectureStartTime && lectureEndTime) {
            lectureStartTime = this.convertToMilliseconds(lectureStartTime);
            lectureEndTime = this.convertToMilliseconds(lectureEndTime);

            if (messageTimeStamp >= lectureStartTime &&
                messageTimeStamp <= lectureEndTime) {
                return true;
            }
        }
        return false;
    }

    /**
     * Convert time ("hh:mm") to milliseconds.
     *
     * @param time
     * @returns {number|*}
     */
    convertToMilliseconds(time) {
        const today = new Date();
        today.setHours(time.substring(0, 2));
        today.setMinutes(time.substring(3, 5));
        today.setSeconds(0);
        time = +today; // '+' Converts to milliseconds.
        return time;
    }

    /**
     * Sort out all valid hashtags.
     * Save them as a new message-property.
     *
     * @param message
     * @returns {*}
     */
    sortValidHashTags(message) {
        let validHashTags = [];

        for (let hashTag of hashTags) {
            const validHashTag = hashTag.hashTag;
            if (this.isValidHashTagIncluded(message.text, validHashTag))
                validHashTags.push(validHashTag);
        }

        if (validHashTags.length > 0) {
            message["hashTags"] = validHashTags;
            return message;
        }
    }

    /**
     * Verify that the valid hashtag is correctly
     * included in message.
     *
     * @param text
     * @param validHashTag
     * @returns {boolean}
     */
    isValidHashTagIncluded(text, validHashTag) {
        switch (true) {
            case text === validHashTag:
            case text.startsWith(`${validHashTag} `):
            case text.includes(` ${validHashTag} `):
            case text.endsWith(` ${validHashTag}`):
                return true;
            default: return false;
        }
    }

    /**
     * Iterate through all valid hashtags.
     * Call appropriate function.
     *
     * @param message
     */
    handleValidHashTags(message) {
        const self = this;
        const cases = {
            '#!': this.handleStreamProblem,
            '#?': this.handleUserQuestion,
            '#I': this.handleInfoRequest
        };

        for (let hashTag of message.hashTags) {
            if (cases[hashTag])
                cases[hashTag](message, self);
        }
    }

    /**
     * Post Bot-response to channel.
     * Call 'LightHandler' if no cooldown.
     *
     * @param message
     * @param self
     */
    handleStreamProblem(message, self) {
        const userName = self.getUserNameByID(message.user);

        self.postBotMessageToChannel(
            message.channel, slackConfig.problemMessage, userName);

        if (self.coolDownCounter == 0) {
            self.initCoolDown();
            self.callLightHandler('3', lampConfig.problemColor);
        }
    }

    /**
     * Post Bot-response to channel.
     * Call 'LightHandler' if no cooldown.
     *
     * @param message
     * @param self
     */
    handleUserQuestion(message, self) {
        const userName = self.getUserNameByID(message.user);

        self.postBotMessageToChannel(
            message.channel, slackConfig.questionMessage, userName);

        if (self.coolDownCounter == 0) {
            self.initCoolDown();
            self.callLightHandler('2', lampConfig.questionColor);
        }

        // TODO: Post question to screen.
    }

    /**
     * Post Bot-response to channel.
     * Call 'LightHandler' if no cooldown.
     *
     * @param message
     * @param self
     */
    handleInfoRequest(message, self) {
        const userName = self.getUserNameByID(message.user);

        self.postBotMessageToChannel(
            message.channel, slackConfig.infoMessage, userName);
    }

    /**
     * Get username from 'users.json' by ID.
     *
     * @param userID
     * @returns {string}
     */
    getUserNameByID(userID) {
        let userName = '';
        for (let user of usersFile) {
            if (user.id === userID) {
                userName = user.name;
            }
        }
        return userName;
    }

    /**
     * Initiate cooldown-effect for Philips Hue.
     */
    initCoolDown() {
        this.coolDownCounter = 15;
        const coolDown = setInterval(() => {
            if (this.coolDownCounter > 0)
                this.coolDownCounter -= 1;
            else clearInterval(coolDown);
        }, 1000);
        coolDown;
    }

    /**
     * Call 'LightHandler' (Philips Hue).
     *
     * @param lampID
     * @param color
     */
    callLightHandler(lampID, color) {
        this.lightHandler.setWarning(
            lampID,
            lampConfig.blinkRate,
            lampConfig.duration,
            color
        );
    }

    /**
     * POST Bot-response to channel
     * in which message has been sent.
     *
     * @param channel
     * @param botMessage
     * @param user
     */
    postBotMessageToChannel(channel, botMessage, user) {
        const path =
            `/api/chat.postMessage
            ?token=${slackConfig.token}
            &channel=${channel}
            &text=${user}:${encodeURIComponent(botMessage)}
            &username=${slackConfig.botName}
            &icon_url=${encodeURIComponent(slackConfig.botImageURL)}`
            .replace(/\s+/g, ''); // Escape spaces.

        const options = {
            hostname: slackConfig.hostName,
            path: path,
            method: 'POST'
        };

        const req = https.request(options, res => {
            console.log(res.statusCode);
            console.log(res.statusMessage);
        });
        req.end();

        req.on('error', error =>
            this.handleError(error));
    }

    /**
     * Console log errors.
     *
     * @param error
     */
    handleError(error) {
        console.log(`An error occurred: ${error}`);
    }

};

module.exports = MessageHandler;