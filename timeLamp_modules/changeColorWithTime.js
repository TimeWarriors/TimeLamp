'use strict';
const co = require('co');

const MyModule = class {
    constructor(s) {
        this.settingsModule = require('../settings/modulesettings.js');

        this.s = s;
        this.timeEdidApiLnu = new this.s.TimeeditDAL(
            'https://se.timeedit.net/web/lnu/db1/schema1/',
            4
            );
    }

    /**
     * [this fuction will run one per day]
     * @return {[type]} [description]
     */
    init(){
        co(function*(){
            let roomSchedule = yield this.getRoomSchedule();
            let moduleSettings = yield this.getModuleSettings();
            let roomColorSchedule = this.roomColorSchedule(roomSchedule, moduleSettings);
            this.makeNodeEmitterSchedule(roomColorSchedule);
        }.bind(this)).catch((er) => {
            console.log(er);
        });
    }

    /**
     * [will call hue change color function]
     * @param  {[type]} color [description]
     * @return {[type]}       [description]
     */
    changeColor(color){
        console.log('poop: ', color);
    }

    /**
     * [will book node schedules to run function at specific time]
     * @param  {[type]} rooms [description]
     * @return {[type]}       [description]
     */
    makeNodeEmitterSchedule(rooms){
        const emitter = this.s.eventEmitter.getEventEmitter();

        rooms.forEach((room) => {
            room.status.forEach((booking) => {
                this.s.nodeSchedule.scheduleFunctionCallJob(
                    new Date(booking.time),
                    this.changeColor,
                    {color: booking.color, roomId: room.roomId}
                );
            });
        });
    }

    /**
     * [returns room schedule]
     * @return {[object]} [room schedule]
     */
    getRoomSchedule(){
        return this.s.settings.getLamps('hue').then((lamps) => {
            return Promise.all(lamps.map((lamp) => {
                return lamp.roomId;
            }).map((roomId) => {
                return this.timeEdidApiLnu.getTodaysRoomSchedule(roomId);
            }));
        });
    }

    /**
     * [retrives module settings]
     * @return {[object]} [module settings]
     */
    getModuleSettings(){
        return this.settingsModule.getModuleSettings();
    }

    /**
     * [builds room color schedule out of room schedule]
     * @param  {[object]} roomSchedule  [schedule of rooms]
     * @param  {[object]} colorSettings [moduleSettings]
     * @return {[object]}               [room color schedule]
     */
    roomColorSchedule(roomSchedule, colorSettings){
        return roomSchedule.map((roomBookingSchedule) => {
            return roomBookingSchedule.reduce((colorSchedule, booking) => {
                let room = {};
                if(!booking.hasOwnProperty('booking')){
                    room.roomId = booking.roomId;
                    room.status = [
                        {
                            time: this.addMinuteToDate(1),
                            color: colorSettings.avalibleColor
                        }
                    ];
                    return room;
                }
                room.roomId = booking.booking.roomId;
                room.status = [
                    {
                        time: this.buildDate(booking.booking.time.endTime),
                        color: colorSettings.avalibleColor
                    },
                    {
                        time: this.buildDate(booking.booking.time.startTime, colorSettings.timeForAlmost),
                        color: colorSettings.almostOccupiedColor
                    },
                    {
                        time: this.buildDate(booking.booking.time.startTime),
                        color: colorSettings.occupiedColor
                    }
                ];
                return room;
            }, {});
        });
    }

    /**
     * [makes new date]
     * @param  {[string]} time    [hour and minute in string]
     * @param  {[int]} timeDif [time diff in minutes]
     * @return {[date]}         [new date object]
     */
    buildDate(time, timeDif){
        let hourMinute = this.splitTime(time);
        let today = new Date();
        let t = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            hourMinute[0],
            hourMinute[1]
        );
        if(timeDif){
            t.setMinutes(t.getMinutes()-timeDif);
        }
        return t;
    }

    /**
     * [add minutes to new date]
     * @param {[int]} addMinute [minutes]
     * @param {[date]} d [date]
     * @return {[date]}          [new date]
     */
    addMinuteToDate(addMinute, d){
        d = d || new Date();
        let t = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes()
        );
        t.setMinutes(t.getMinutes()+addMinute);
        return t;
    }

    splitTime(timeString){
        return timeString.split(':');
    }
};

exports.run = function(s){
    return new MyModule(s);
};
