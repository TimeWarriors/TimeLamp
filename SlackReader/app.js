'use strict';

const SlackReader = require('./SlackAPI/SlackReader.js');


var slack = new SlackReader();
slack.convertStartTimeToMilliseconds();


slack.getAllChannels()
    .then(channelsObject => {
        // Test purpose. Get this array from somewhere else.
        var channelNames = ['1dv409', '1dv405', '1dv450'];
        return slack.getChannelNamesAndIDs(channelsObject, channelNames);
    })
    .then(channels => {
        // Get 'channelName' from TimeEdit.
        var channelName = '1dv450';
        return slack.getChannelID(channels, channelName);
    })
    .then(channelID => {
        // Test purpose. Get starttime from TimeEdit.
        //var lectureStartTime = '1455106500'; // 10/2-2016 Kl: 13:15.
        var lectureStartTime = slack.convertStartTimeToMilliseconds('1315');
        return slack.getChatMessagesFromStartTime(channelID, lectureStartTime);
    })
    .then(messages => {
        // Test purpose.
        var postedMessages = 0;
        if (slack.isNewMessagePosted(messages, postedMessages)) {
            var newMessages = slack.getNewMessages(messages, postedMessages);
            return slack.searchForHashTags(newMessages);
        } else {
            console.log('No new messages!');
        }
    })
    .then(messages => {
        console.log(messages);
        // TODO: Call functions depending on hashtags.
    })
    .catch(error => {
        console.log(error);
    });
