'use strict';

/*
 * This file is just for development purpose. 'SlackAPI.js' is the mainfile
 * which will be called upon from TimeLamp.
 */

const SlackAPI = require('./SlackAPI/SlackAPI.js');
const slackAPI = new SlackAPI();


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