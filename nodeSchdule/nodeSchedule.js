'use strict';
const nodeSchedule = require('node-schedule');

const NodeSchedule =  class {
    constructor() {
    }

    /**
     * [schedules an event att a specific time and emitts a value]
     * @param  {[objct]} dateTimeObject [new Date() object]
     * @param  {[object]} emitter        [an event emitter]
     * @param  {[string]} emittId        [id to emitt on]
     * @param  {[object]} data           [anything the user wants to be returned]
     * @return {[object]}                [instance of nodeSchedule]
     */
    scheduleEmittJobb(dateTimeObject, emitter, emittId, data){
        return nodeSchedule.scheduleJob(dateTimeObject, function() {
            emitter.emit(emittId, data);
        }.bind(this, emitter, emittId, data));
    }

    /**
     * [schedule an event at a specific time, fires on promise]
     * @param  {[object]} dateTimeObject [new Date() object]
     * @param  {[object]} data           [anything the user wants to be returned]
     * @return {[promise]}               [promise]
     */
    scheduleJob(dateTimeObject ,data){
        return new Promise(function(resolve, reject) {
            nodeSchedule.scheduleJob(dateTimeObject, function(){
                resolve(data);
            }.bind(this, data));
        });
    }

    /**
     * [schedules a jobb and runs it every day]
     * @param  {[array]} dayOfWeek [containing start day of week and end day of week tex. [0, 4] monday to friday]
     * @param  {[int]} hour      [at what hour will event accur]
     * @param  {[int]} minute    [at whar minute will event accur]
     * @param  {[object]} emitter   [an event emitter]
     * @param  {[string]} emittId   [id to emitt on]
     * @param  {[object]} data      [anything the user wants to be included in function call]
     * @return {[object]}           [instance of node schedule]
     */
    scheduleRecurrenceEmittJob(emitter, emittId, data, minute, hour, dayOfWeek){
        let rule = this._makeRule(minute, hour, dayOfWeek);
        return nodeSchedule.scheduleJob(rule, function(){
            emitter.emit(emittId, data);
        }.bind(this, emitter, emittId, data));
    }

    /**
     * [schedule a function call att a specific time]
     * @param  {[object]} dateTimeObject [new Date() object]
     * @param  {[function]} func         [a function the user wnts to run at specific time]
     * @param  {[object]} data           [anything the user wants to be returned]
     * @return {[object]}                [instance of node schedule]
     */
    scheduleFunctionCallJob(dateTimeObject, func, data){
        return nodeSchedule.scheduleJob(dateTimeObject, function() {
            func(data);
        }.bind(this, func, data));
    }

    /**
     * [schedules jobb and runs it every day]
     * @param  {[array]} dayOfWeek [containing start day of week and end day of week tex. [0, 4] monday to friday]
     * @param  {[int]} hour      [at what hour will event accur]
     * @param  {[int]} minute    [at whar minute will event accur]
     * @param  {[function]} func      [function to be run at specific time]
     * @param  {[object]} data      [anything the user wants to be included in function call]
     * @return {[object]}           [instance of node schedule]
     */
    scheduleRecurringFunctionCallJob(func, data, minute, hour, dayOfWeek){
        let rule = this._makeRule(minute, hour, dayOfWeek);
        return nodeSchedule.scheduleJob(rule, function(){
            func(data);
        }.bind(this, func, data));
    }

    _makeRule(minute, hour, dayOfWeek){
        let rule = new nodeSchedule.RecurrenceRule();
        if(hour){
            rule.hour = hour;
        }
        if(dayOfWeek){
            rule.dayOfWeek = [0, new nodeSchedule.Range(dayOfWeek[0], dayOfWeek[1])];
        }
        rule.minute = minute;
        return rule;
    }

};

module.exports = new NodeSchedule();
