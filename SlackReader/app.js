'use strict';

const SlackAPI = require('./SlackAPI/SlackAPI.js');
const slackAPI = new SlackAPI();
const TimeLamp = require('../settings/settings.js');
const timeLamp = new TimeLamp();


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


console.log(timeLamp.getLampsinRoom('Ny106K'));