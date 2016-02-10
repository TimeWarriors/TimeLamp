'use strict';
const co = require('co');


// TODO: throw everyting out, start from the begining.
const MyModule = class {
    constructor(s) {
        this.settingsModule = require('../settings/modulesettings.js');

        this._ = s;
        this.timeEdidApiLnu = new this._.TimeeditDAL(
                'https://se.timeedit.net/web/lnu/db1/schema1/',
                4
            );
    }

    /**
     * [this fuction will run one (or more) per day]
     * @return {[type]} [description]
     */
    init(){
        co(function*(){
            let lamps = yield this._.settings.getLamps('hue');
            let roomIds = this.getRoomIdsFomLamps(lamps);
            let roomSchedule = yield this.getRoomSchedule(roomIds);
            let moduleSettings = yield this.settingsModule.getModuleSettings();

            this.setDefaultColor(lamps, moduleSettings);
            return this.roomColorSchedule(roomSchedule, moduleSettings);
        }.bind(this)).then((roomColorSchedule) => {
            console.log(JSON.stringify(roomColorSchedule, null, 2));
            //this.makeNodeEmitterSchedule(roomColorSchedule);
        }).catch((er) => {
            console.log(er);
        });
    }

    /**
     * [will call hue change color function or hue warning function]
     * @param  {[type]} color [description]
     * @return {[type]}       [description]
     */
    changeColor(object){
        this._.settings.getLampsinRoom(object.roomId)
            .then((lampsInRoom) => {
                lampsInRoom.forEach((lamps) => {
                    if(object.hasOwnProperty('warning') && object.warning === true){
                        this._.lightHandler.Warning(lamps.lampId, null, object.fadeTime);
                    } else{
                        this._.lightHandler.changeColor(lamps.lampId, object.color[0],
                            object.color[1], object.color[2], object.fadeTime);
                    }
                });
            }).catch((er) => {
                console.log(er);
            });
    }

    /**
     * [sets the default color for lapms]
     * @param {[array]} lamps          [array of lamp objects]
     * @param {[object]} moduleSettings [settings object for this module]
     */
    setDefaultColor(lamps, moduleSettings){
        lamps.map((lamp) => {
            return lamp.lampId;
        }).forEach((lampId) => {
            this._.lightHandler.changeColor(lampId, moduleSettings.defaltColor[0],
                moduleSettings.defaltColor[1], moduleSettings.defaltColor[2]);
        });
    }

    /**
     * [will book node schedules to run function at specific time]
     * @param  {[type]} rooms [description]
     * @return {[type]}       [description]
     */
    makeNodeEmitterSchedule(rooms){
        rooms.forEach((bookings) => {
            bookings.forEach((booking) => {
                booking.status.forEach((status) => {
                    this._.nodeSchedule.scheduleFunctionCallJob(
                        new Date(status.time),
                        this.changeColor.bind(this),
                        {color: status.color, roomId: booking.roomId, fadeTime: status.fadeTime }
                    );
                });
            });
        });
    }

    /**
     * [returns room schedule]
     * @return {[object]} [room schedule]
     */
    getRoomSchedule(roomIds){
        return Promise.all(roomIds.map((roomId) => {
                return this.timeEdidApiLnu.getTodaysRoomSchedule(roomId);
            }));
    }

    /**
     * [retrives rooms id from lamb object]
     * @param  {[object]} lamps [collection of lamps]
     * @return {[object]}       [collection of roomdId]
     */
    getRoomIdsFomLamps(lamps){
        return lamps.map((lamp) => {
                return lamp.roomId;
            });
    }

    // TODO: make this function pritier!!!!!
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
                room.status = [];
                if(!booking.hasOwnProperty('booking')){
                    room.roomId = booking.roomId;
                    room.status.push(
                        {
                            time: this.addMinuteToDate(1),
                            color: colorSettings.avalibleColor,
                            fadeTime: null
                        }
                    );
                    colorSchedule.push(room);
                    return colorSchedule;
                }

                if(this.isRoomBookedNow(booking.booking.time)){
                    room.status.push(
                        {
                            time: this.addMinuteToDate(1),
                            color: colorSettings.occupiedColor,
                            fadeTime: null
                        }
                    );
                }
                room.roomId = booking.booking.roomId;
                room.status.push(
                    { // gå till yellow // 120
                        time: this.buildDate(booking.booking.time.startTime, colorSettings.timeForFadeToStart),
                        color: colorSettings.fadeStartColor,
                        fadeTime: this.minutesToSeconds(colorSettings.timeForFadeToStart/2)
                    },
                    {  // gå till orange // 60
                        time: this.buildDate(booking.booking.time.startTime, colorSettings.timeForFirstCheckpoint),
                        color: colorSettings.firstCheckpointColor,
                        fadeTime: this.minutesToSeconds(colorSettings.timeForFirstCheckpoint/2)
                    },
                    { // gå till red // 30
                        time: this.buildDate(booking.booking.time.startTime, colorSettings.timeForSecondCheckpoint),
                        color: colorSettings.secondCheckpointColor,
                        fadeTime: this.minutesToSeconds(colorSettings.timeForSecondCheckpoint/2)
                    },
                    { // blinka red // 5
                        time: this.buildDate(booking.booking.time.startTime, colorSettings.timeForLastCheckpoint),
                        color: colorSettings.lastCheckpoint,
                        fadeTime: this.minutesToSeconds(colorSettings.timeForLastCheckpoint),
                        warning: true
                    },
                    { // vara red
                        time: this.buildDate(booking.booking.time.startTime),
                        color: colorSettings.occupiedColor,
                        fadeTime: null
                    },
                    { // vara green
                        time: this.buildDate(booking.booking.time.endTime),
                        color: colorSettings.avalibleColor,
                        fadeTime: null
                    });
                colorSchedule.push(room);
                return colorSchedule;
            }, []);
        });
    }

    minutesToSeconds(minutes){
        return minutes * 60;
    }

    /**
     * [check if time is between two times]
     * @param  {[object]}  bookingTime [object of times]
     * @return {Boolean}             [if time is between two times or not]
     */
    isRoomBookedNow(bookingTime){
        let startDate = this.buildDate(bookingTime.startTime);
        let endDate = this.buildDate(bookingTime.endTime);
        let today = new Date();
        return startDate.getTime() < today.getTime() &&
        endDate.getTime() > today.getTime();
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
