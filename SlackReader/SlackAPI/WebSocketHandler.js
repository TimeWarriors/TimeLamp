'use strict';

const WebSocketClient = require('websocket').client;
const slackConfig = require('../slackConfig.json');
const https = require('https');


const WebSocketHandler = class {
    constructor() {
        // Empty for now.
    }

    getWebSocketURL() {
        return new Promise((resolve, reject) => {
            let options = {
                hostname: slackConfig.hostName,
                path: `/api/rtm.start?token=${slackConfig.token}`,
                method: 'GET'
            };

            let req = https.request(options, res => {
                let chunks = [];

                res.on('data', chunk => {
                    chunks.push(chunk);
                }).on('end', () => {
                    let body = Buffer.concat(chunks);
                    body = JSON.parse(body);
                    return resolve(body.url);
                });
            }).on('error', error => {
                return reject(error);
            }).end();
        });
    }

    connectToWebSocket(url) {
        let self = this;
        let client = new WebSocketClient();
        client.connect(url);

        client.on('connect', function(connection) {
            console.log('WebSocket Client Connected');

            connection.on('message', function(message) {
                let msg = JSON.parse(message.utf8Data);

                if (msg.type === 'message') {
                    console.log(msg.text);
                    if (msg.text.includes('#')) {
                        self.handleMessage(msg.text);
                    }
                }
            });
        });
    }

    handleMessage(message) {
        let self = this;
        // TODO: Handle message.
    }

};

module.exports = WebSocketHandler;