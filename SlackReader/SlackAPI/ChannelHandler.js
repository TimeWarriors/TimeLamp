'use strict';

const coursesFile = require('../courses.json');
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
        const timeEditURL = 'https://se.timeedit.net/web/lnu/db1/schema1/';
        this.timeEditApi = new TimeEditApi(timeEditURL, 5);
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
    sortOutChannels(allChannels) {
        //const courseCodes = this.courses.codes;
        allChannels = allChannels.channels;
        let channels = [];

        for (let code of coursesFile) {
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
     * Update 'channels.json' and add schedule
     * for all relevant channels.
     *
     * @param channels
     * @returns {*}
     */
    getScheduleForChannels(channels) {
        for (let channel of channels) {
            const schedule = await (
                this.timeEditApi.getTodaysSchedule(channel.courseCode));

            /* Verify that schedule "time"-property is defined */
            if (this.isTimeDefined(schedule[0], 'booking', 'time')) {
                if (schedule[0].booking.columns[5] == 'Föreläsning') {
                    const lectureRoom = schedule[0].booking.columns[2];
                    const startTime = schedule[0].booking.time.startTime;
                    const endTime = schedule[0].booking.time.endTime;
                    channel['lectureRoom'] = lectureRoom;
                    channel['todayStartTime'] = startTime;
                    channel['todayEndTime'] = endTime;
                }
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
            if (!schedule.hasOwnProperty(arg)) return false;
            schedule = schedule[arg];
        }
        return true;
    }

    /**
     * Save room lamp-ID for all channels.
     *
     * @param channels
     * @returns {*}
     */
    getLampIDsForChannels(channels) {
        for (let channel of channels) {
            if (channel.hasOwnProperty('lectureRoom')) {
                // Exclude 'K' in room-name. 'getLampsinRoom' won't work otherwise.
                const room = channel.lectureRoom.toLowerCase().substring(0, 4);
                const lampIDs = await (this.TimeLamp.getLampsinRoom(room));
                channel['lampIDs'] = lampIDs;
            }
        }
        return channels;
    }

    /**
     * Save channels to 'channels.json'.
     *
     * @param channels
     */
    saveChannels(channels) {
        Jsonfile.spaces = 4;
        Jsonfile.writeFileSync(channelsFile, channels);
    }

};

module.exports = ChannelHandler;