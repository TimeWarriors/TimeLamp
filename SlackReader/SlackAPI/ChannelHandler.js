'use strict';

const coursesFile = './courses.json';
const channelsFile = './channels.json';
const slackConfig = require('../slackConfig.json');
const https = require('https');
const Jsonfile = require('jsonfile');
Jsonfile.spaces = 4;


const ChannelHandler = class {
    constructor() {
        this.courses = Jsonfile.readFileSync(coursesFile);
    }

    getAllChannels() {
        return new Promise((resolve, reject) => {

            let options = {
                hostname: slackConfig.hostName,
                path: '/api/channels.list?token=' + slackConfig.token + '&pretty=1',
                method: 'GET'
            };

            let req = https.request(options, res => {
                let chunks = [];

                res.on('data', chunk => {
                    chunks.push(chunk);
                }).on('end', () => {
                    let body = Buffer.concat(chunks);
                    return resolve(JSON.parse(body));
                });
            }).on('error', error => {
                return reject(error);
            }).end();
        });
    }

    getChannels(allChannels) {
        let courseCodes = this.courses.codes;
        allChannels = allChannels.channels;
        let channels = [];

        for (let code of courseCodes) {
            for (let channel of allChannels) {
                if (channel.name.includes(code)) {
                    let channelProps = {
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

    saveChannels(channels) {
        Jsonfile.writeFileSync(channelsFile, channels);
    }
};

module.exports = ChannelHandler;