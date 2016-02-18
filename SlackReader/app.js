'use strict';

let SlackReader = require('./SlackAPI/SlackReader.js');
let SlackChannels = require('./SlackAPI/SlackChannels');
let SlackMessages = require('./SlackAPI/SlackMessages');

var slackReader = new SlackReader();
var slackChannels = new SlackChannels();
var slackMessages = new SlackMessages();


slackChannels.getAllChannels()
    .then(channelsObject => {
        // Test purpose. Get this array from somewhere else.
        var channelNames = ['1dv409', '1dv405', '1dv450'];
        return slackChannels.pairDesiredChannelNamesWithIDs(channelsObject, channelNames);
    })
    .then(channels => {
        // Get 'channelName' from TimeEdit.
        var channelName = '1dv450';
        return slackChannels.getChannelID(channels, channelName);
    })
    .then(channelID => {
        // Test purpose. Get starttime from TimeEdit.
        var lectureStartTime = '1455106500'; // (10/2-2016 Kl: 13:15)
        //var lectureStartTime = slackReader.convertStartTimeToMilliseconds('13:15');
        return slackMessages.getChatMessagesFromStartTime(channelID, lectureStartTime);
    })
    .then(messages => {
        // Test purpose.
        var postedMessages = 0;
        if (slackMessages.isNewMessagePosted(messages, postedMessages)) {
            var newMessages = slack.getNewMessages(messages, postedMessages);
            return slackMessages.searchForHashTags(newMessages);
        } else {
            console.log('No new messages has been posted!');
        }
    })
    .then(messages => {
        slackMessages.handleMessages(messages);
    })
    .catch(error => {
        console.log(error);
    });
