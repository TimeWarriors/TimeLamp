'use strict';

const coursesFile = './courses.json';
const channelsFile = './channels.json';
const slackConfig = require('../slackConfig.json');
const https = require('https');
const Jsonfile = require('jsonfile');
const TimeEditApi = require('timeeditapi');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const TimeLamp = require('../../settings/settings.js');


const ChannelHandler = class {

    constructor() {
        this.courses = Jsonfile.readFileSync(coursesFile);
        this.timeEditApi = new TimeEditApi(
            'https://se.timeedit.net/web/lnu/db1/schema1/', 5);
    }

    /**
     * GET all channels from team "CoursePress".
     *
     * @returns {Promise}
     */
    getAllChannels() {
        return new Promise((resolve, reject) => {
            const path =
                `/api/channels.list
                ?token=${slackConfig.token}`
                .replace(/\s+/g, ''); // Escape spaces.

            const options = {
                hostname: slackConfig.hostName,
                path: path,
                method: 'GET'
            };

            const req = https.request(options, res => {
                let chunks = [];

                res.on('data', chunk =>
                    chunks.push(chunk));

                res.on('end', () => {
                    let body = Buffer.concat(chunks);
                    resolve(JSON.parse(body));
                });
            });
            req.end();

            req.on('error', error =>
                reject(error));
        });
    }

    /**
     * Sort out the channels we want.
     * Save the properties we need.
     *
     * @param allChannels
     * @returns {Array}
     */
    getChannels(allChannels) {
        const courseCodes = this.courses.codes;
        allChannels = allChannels.channels;
        let channels = [];

        for (let code of courseCodes) {
            for (let channel of allChannels) {
                if (channel.name.includes(code)) {
                    const channelProps = {
                        "name": channel.name,
                        "courseCode": code,
                        "id": channel.id
                    };
                    channels.push(channelProps);
                }
            }
        }
        return channels;
    }

    /**
     * Update 'channel.json' and add schedule
     * for all relevant channels.
     *
     * @param channels
     * @returns {*}
     */
    getScheduleForChannels(channels) {
        for (let channel of channels) {
            const schedule = await (
                this.timeEditApi.getTodaysSchedule(channel.courseCode));
            // Verify that schedule time-property is defined.
            if (this.isTimeDefined(schedule[0], 'booking', 'time')) {
                const lectureRoom = schedule[0].booking.columns[2];
                const startTime = schedule[0].booking.time.startTime;
                const endTime = schedule[0].booking.time.endTime;
                channel['lectureRoom'] = lectureRoom;
                channel['todayStartTime'] = startTime;
                channel['todayEndTime'] = endTime;
            }
        }
        return channels;
    }

    getLampIDForChannels(channels) {
        for (let channel of channels) {
            if (channel.hasOwnProperty('lectureRoom')) {
                const room = channel.lectureRoom.toLowerCase().substring(0, 4);
                let lampIDs = await (this.TimeLamp.getLampsinRoom(room));
                lampIDs = lampID[0].lampId; // TODO: Change this.
                channel['lampID'] = lampIDs;
            }
        }
        return channels;
    }

    /**
     * Search the schedule-object
     * and look for "time"-property.
     *
     * @param schedule
     * @returns {boolean}
     */
    isTimeDefined(schedule) {
        const args = Array.prototype.slice.call(arguments, 1);

        for (let arg of args) {
            if (!schedule.hasOwnProperty(arg)) {
                return false;
            }
            schedule = schedule[arg];
        }
        return true;
    }

    /**
     * Save channels to 'channel.json'.
     *
     * @param channels
     */
    saveChannels(channels) {
        Jsonfile.spaces = 4;
        Jsonfile.writeFileSync(channelsFile, channels);
    }

};

module.exports = ChannelHandler;