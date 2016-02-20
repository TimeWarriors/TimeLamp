'use strict';

const ModuleLoader = require('./mouduleLoader/moduleLoader.js');
const nodeSchedule = require('./nodeSchdule/nodeSchedule.js');
const eventEmitter = require('./eventEmitter/eventEmitter.js');
const LightHandler = require('./lightHandler/lightHandler.js');
const settings = require('./settings/settings.js');
const TimeeditDAL = require('./timeeditDAL/timeeditDAL.js');

const lightHandler = new LightHandler();
const emitter = eventEmitter.getEventEmitter();

/*functions to sent to all modules*/
const functionLayer = {
    nodeSchedule,
    emitter,
    TimeeditDAL,
    settings,
    lightHandler
};
const moduleLoader = new ModuleLoader(functionLayer);

/*Jobb creation*/
const jobbOncePerDay = nodeSchedule.scheduleRecurrenceEmittJob(
    emitter, 'daily', {}, 0, 9, [0, 4]);

const jobbEveryHour = nodeSchedule.scheduleRecurrenceEmittJob(
    emitter, 'hourly', {}, 0, 4, null);

/*Emit listeners*/
emitter.on('daily', (data) => {
    moduleLoader.runModules();
});

emitter.on('hourly', (data) => {
    moduleLoader.runModules();
});

emitter.on('time_15', (event) => {
    console.log('15 min');
});

emitter.on('time_5', (event) => {
    console.log('5 min');
});
