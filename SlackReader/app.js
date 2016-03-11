'use strict';

const SlackAPI = require('./SlackAPI/SlackAPI.js');
const slackAPI = new SlackAPI();


// TODO: lamp cooldown för varje specifik lampa.

/**********************************/
/* Update ConfigFile for Channels */
/**********************************/
//slackAPI.updateChannelsFile();

/*******************************/
/* Update ConfigFile for Users */
/*******************************/
//slackAPI.updateUsersFile();

/******************************/
/* Connect to Slack WebSocket */
/******************************/
//slackAPI.initWebSocket();