'use strict';

const moduleLoader = require('./mouduleLoader/moduleLoader.js');
const nodeSchedule = require('./nodeSchdule/nodeSchedule.js');
const eventEmitter = require('./eventEmitter/eventEmitter.js');
const LightHandler = require('./lightHandler/lightHandler.js');
const settings = require('./settings/settings.js');
const TimeeditDAL = require('./timeeditDAL/timeeditDAL.js');

const emitter = eventEmitter.getEventEmitter();
const lightHandler = new LightHandler();

const ModuleHandeler = class {
    constructor() {
        this.initLoadModules();
        this.runAllTimelampModules();
        this.dailyJob();
    }

    /**
     * [require timeLamp_modules]
     */
    initLoadModules(){
        this.modules = [];
        this.modules.push(require('./timeLamp_modules/changeColorWithTime.js').run(this.classModuleWrap()));
    }

    /**
     * [schedules daily node job]
     */
    dailyJob(){
        const nodeJobb =  nodeSchedule.scheduleRecurrenceEmittJob(
            emitter, 'daily', {}, 14, 15, [0, 4]);
    }

    /**
     * [runs init function on every module in timeLamp_module]
     */
    runAllTimelampModules(){
        try {
            this.modules.forEach(m => m.init(this.classModuleWrap()));
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * [wraps most inportat modules to send it to timeLamp_modules]
     * @return {[object]} [object with classes]
     */
    classModuleWrap(){
        return {
            moduleLoader,
            nodeSchedule,
            eventEmitter,
            TimeeditDAL,
            settings,
            lightHandler
        };
    }
};
const moduleHandeler = new ModuleHandeler();

emitter.on('daily', (data) => {
    moduleHandeler.runAllTimelampModules();
});
