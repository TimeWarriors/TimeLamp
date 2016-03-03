'use strict';
const co = require('co');

const Nightmode = class {
    constructor(functionLayer) {

        this._ = functionLayer;
        this.dateHelper = require('./moduleHelpers/dateHelper.js');
        this.arrayHelper = require('./moduleHelpers/arrayHelper.js');
        this.timeEdidApiLnu = new this._.TimeeditDAL(
            'https://se.timeedit.net/web/lnu/db1/schema1/',
            4
        );
        this.nightmodeStartTime = this.dateHelper.buildDateFromString('21:00'); // TODO: get this from some settings file
        this.nightmodeEndTime = this.dateHelper.addDayToDate(1,
            this.dateHelper.buildDateFromString('04:00')); // TODO: get this from some settings file

        this.nightmodeColor = 46920; // TODO: get this from some settings file
        this.defaultColor = 25500;
    }

    init(){
        co(function* (){
            let lampSettings = yield this.getLampSettings('hue');
            let lampRoomIds = this.getRoomIdsFromLamps(lampSettings);
            let lampHueIds = this.getHueLampId(lampSettings);
            let roomSchedule = yield this.getTodaysRoomSchedule(lampRoomIds);

            return this.arrayHelper.concatArray(roomSchedule);
        }.bind(this))
            .then((bookings) => {
                return this.getNightmodePosible(bookings);
            }).then((roomIds) => {
                console.log(roomIds);
                this.makeNodeSchedule(roomIds, this.nightmodeStartTime, this.nightmodeColor, 0);
                this.makeNodeSchedule(roomIds, this.nightmodeEndTime, this.defaultColor, 254);
            }).catch((er) => {
                console.log(er);
            });
    }

    runNightmode(props){
        console.log('hej');
        console.log(props);
        this._.settings.getLampsinRoom(props.roomId)
            .then((lampsInRoom) => {
                lampsInRoom.forEach((lamp) => {
                    this._.lightHandler.changeColorWithHue(lamp.lampId,
                        props.color, 0);
                    this._.lightHandler.changeBrightness(lamp.lampId, props.brightness, 0);
                });
            });
    }

    makeNodeSchedule(roomIds, time, color, brightness){
        return roomIds.map(room => {
            return this._.nodeSchedule.scheduleFunctionCallJob(
                time,
                this.runNightmode.bind(this),{
                    roomId: room.id,
                    color,
                    brightness
                }
            );
        });
    }

    getNightmodePosible(bookings, nightmodeStartTime){
        let mySet = new Set();
        let univibleRoomIds = bookings.filter(item => item.hasOwnProperty('booking'))
            .filter(item =>
                !this.isNightmodePosible(this.dateHelper.buildDateFromString(item.booking.time.endTime)))
            .map(item => item.booking.id);

        let bookedRooms = bookings.filter(item => item.hasOwnProperty('booking'))
            .filter(item =>
                this.isNightmodePosible(this.dateHelper.buildDateFromString(item.booking.time.endTime)))
            .filter(item => univibleRoomIds.indexOf(item.booking.id))
            .filter(item => {
                if(mySet.has(item.id)){ return false; }
                mySet.add(item.id);
                return true; })
            .map(item => { return { id:item.booking.id}; });

        let unBookedRooms = bookings.filter(item => !item.hasOwnProperty('booking'));
        return this.arrayHelper.mergeArrays(bookedRooms, unBookedRooms);
    }

    isNightmodePosible(bookingEndTime){
        return bookingEndTime <= this.nightmodeStartTime;
    }

    getLampSettings(lampType){
        return new Promise((resolve, reject) => {
            resolve(this._.settings.getLamps(lampType));
        });
    }

    getRoomIdsFromLamps(lamps){
        return lamps.map(lamp => lamp.roomId);
    }

    getHueLampId(lamps){
        return lamps.map(lamp => lamp.lampId);
    }

    getTodaysRoomSchedule(ids){
        return Promise.all(ids.map(id =>
            this.timeEdidApiLnu.getTodaysSchedule(id)));
    }
};

exports.run = function(functionLayer){
    return new Nightmode(functionLayer);
};


// 46920
