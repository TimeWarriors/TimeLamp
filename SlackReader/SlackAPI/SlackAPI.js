'use strict';

const ChannelHandler = require('./ChannelHandler.js');
const MessageHandler = require('./MessageHandler.js');
const WebSocketHandler = require('./WebSocketHandler.js');
const slackConfig = require('../slackConfig.json');
const https = require('https');
const channelsFile = './channels.json';
const Jsonfile = require('jsonfile');
Jsonfile.spaces = 4;
const WebSocketClient = require('websocket').client;


const SlackAPI = class {
    constructor() {
        this.channelHandler = new ChannelHandler();
        this.messageHandler = new MessageHandler();
        this.webSocketHandler = new WebSocketHandler();
        this.channels = Jsonfile.readFileSync(channelsFile);
    }

    updateChannelsFile() {
        /* 1. Get all channels from Coursepress.
         * 2. Sort out the channels we want.
         * 3. Save those channels to file. */
        this.channelHandler.getAllChannels()
            .then(allChannels => {
                return this.channelHandler.getChannels(allChannels);
            })
            .then(channels => {
                this.channelHandler.saveChannels(channels);
            })
            .catch(error => {
                console.log(error);
            });
    }

    initWebSocket() {
        this.webSocketHandler.getWebSocketURL()
            .then(url => {
                this.webSocketHandler.connectToWebSocket(url);
            })
            .catch(error => {
                console.log(error);
            });
    }

    /*
    getMessages(courseCode, lectureStartTime) {
        let channelID = this.getChannelID(this.channels, courseCode);

        this.messageHandler.getMessages(channelID, lectureStartTime)
            .then(messages => {
                if (this.messageHandler.isNewMessagePosted(messages)) {
                    messages = this.messageHandler.sortOutMessages(messages);
                    this.messageHandler.handleMessages(messages);
                } else {
                    console.log('No new messages have been posted!');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    */

    /*
    getChannelID(channels, courseCode) {
        for (let channel of channels) {
            if (courseCode.includes(channel.courseCode)) {
                return channel.id;
            }
        }
    }
    */

    convertToMilliseconds(time) {
        // (time format = 'xx:xx')
        let today = new Date();
        today.setHours(time.substring(0, 2));
        today.setMinutes(time.substring(3, 5));
        today.setSeconds(0);
        time = +today; // '+' Converts to milliseconds.
        return time;
    }

};

module.exports = SlackAPI;