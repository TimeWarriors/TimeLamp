'use strict';

const https = require('https');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const Jsonfile = require('jsonfile');
const slackConfig = require('../slackConfig.json');
const usersFile = './users.json';


const UserHandler = class {

    constructor() {
        // Empty.
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            const path =
                `/api/users.list
                ?token=${slackConfig.token}`
                .replace(/\s+/g, '');

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

    getDesiredUserProps(users) {
        users = users.members;
        let userProps = [];

        for (let user of users) {
            const userProp = {
                "id": user.id,
                "name": user.name
            };
            userProps.push(userProp);
        }
        return userProps;
    }

    saveUsers(users) {
        Jsonfile.spaces = 4;
        Jsonfile.writeFileSync(usersFile, users);
    }

};

module.exports = UserHandler;