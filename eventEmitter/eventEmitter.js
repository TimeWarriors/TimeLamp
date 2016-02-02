'use strict';
const eventEmitter = require('events').EventEmitter;

const EventEmitter = class {
    constructor(){
        this.eventEmitter = new eventEmitter();
    }

    getEventEmitter(){
        return this.eventEmitter;
    }
};


module.exports = new EventEmitter();
