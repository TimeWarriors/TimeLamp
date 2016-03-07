'use strict';

const UserHandler = require('./UserHandler.js');
const ChannelHandler = require('./ChannelHandler.js');
const WebSocketHandler = require('./WebSocketHandler.js');
const https = require('https');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const slackConfig = require('../slackConfig.json');
const channelsFile = './channels.json';
const Jsonfile = require('jsonfile');


const SlackAPI = class {

    constructor(eventEmitter) {
        this.userHandler = new UserHandler();
        this.channelHandler = new ChannelHandler();
        this.webSocketHandler = new WebSocketHandler(eventEmitter);
        this.channels = Jsonfile.readFileSync(channelsFile);
        this.startUp();
    }

    /**
     * Start up Slack Reader.
     */
    startUp() {
        const startUp = async (() => {
            await (this.updateChannelsFile());
            await (this.updateUsersFile());
            this.initWebSocket();
        });
        startUp();
    }

    /**
     * Update 'users.json'. Save username and ID
     * for all users in team "CoursePress".
     */
    updateUsersFile() {
        const update = async (() => {
            try {
                let allUsers = await (this.userHandler.getAllUsers());
                allUsers = this.userHandler.getDesiredUserProps(allUsers);
                this.userHandler.saveUsers(allUsers);
            } catch (error) {
                console.log(error);
            }
        });
        update();
    }

    /**
     * Update 'channels.json'. Save name, course-code, id,
     * todays lecture start- and endtime for channels.
     */
    updateChannelsFile() {
        const update = async (() => {
            try {
                const allChannels = await (this.channelHandler.getAllChannels());
                let channels = this.channelHandler.getChannels(allChannels);
                channels = await (this.channelHandler.getScheduleForChannels(channels));
                // TODO: lös detta
                //channels = await (this.channelHandler.getLampIDForChannels(channels));
                this.channelHandler.saveChannels(channels);
            } catch (error) {
                console.log(error);
            }
        });
        update();
    }

    /**
     * Establish connection to Slack WebSocket-server.
     */
    initWebSocket() {
        const webSocket = async (() => {
            try {
                const url = await (this.webSocketHandler.getWebSocketURL());
                this.webSocketHandler.connectToWebSocket(url);
            } catch (error) {
                console.log(error);
            }
        });
        webSocket();
    }

};

module.exports = SlackAPI;