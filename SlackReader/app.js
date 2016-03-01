'use strict';

const SlackAPI = require('./SlackAPI/SlackAPI.js');
let slackAPI = new SlackAPI();



/* Update ConfigFile for Channels */
//slackAPI.updateChannelsFile();

/* Get latest messages for specific Slack channel */
//slackAPI.getMessages('1dv450', '1455106500');

slackAPI.initWebSocket();