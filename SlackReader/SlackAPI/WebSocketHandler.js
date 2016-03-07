'use strict';

const WebSocketClient = require('websocket').client;
const MessageHandler = require('./MessageHandler.js');
const slackConfig = require('../slackConfig.json');
const https = require('https');


const WebSocketHandler = class {

    constructor() {
        this.messageHandler = new MessageHandler();
    }

    /**
     * GET URL to Slacks WebSocket-server.
     *
     * @returns {Promise}
     */
    getWebSocketURL() {
        return new Promise((resolve, reject) => {
            const path =
                `/api/rtm.start
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
                    body = JSON.parse(body);
                    resolve(body.url);
                });
            });
            req.end();

            req.on('error', error =>
                reject(error));
        });
    }

    /**
     * Connect to Slacks WebSocket-server.
     *
     * @param url
     */
    connectToWebSocket(url) {
        const client = new WebSocketClient();
        client.connect(url);

        client.on('connect', connection =>
            this.handleConnection(connection));

        client.on('connectFailed', error =>
            this.handleError(error));
    }

    /**
     * Handle WebSocket connection when connected.
     *
     * @param connection
     */
    handleConnection(connection) {
        connection.on('message', message =>
            this.messageHandler.handleMessage(message));

        connection.on('error', error =>
            this.handleError(error));
    }

    /**
     * Console log error.
     *
     * @param error
     */
    handleError(error) {
        console.log(`An error occurred: ${error}`);
    }

};

module.exports = WebSocketHandler;