'use strict';
const Emitter = require('events').EventEmitter;

const e = new Emitter();
const EventEmitter = class {
    constructor(){

    }

    getEventEmitter(){
        return e;
    }
};


module.exports = new EventEmitter();
