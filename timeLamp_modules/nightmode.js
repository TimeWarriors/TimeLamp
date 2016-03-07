'use strict';
const co = require('co');
const dateHelper = require('./moduleHelpers/dateHelper.js');
const arrayHelper = require('./moduleHelpers/arrayHelper.js');
const Nightmode = class {
    constructor(functionLayer) {
        this._ = functionLayer;
        this.nodeSchedules = [];
        this.settingsModule = require('../settings/modulesettings.js');
        this.timeEdidApiLnu = new this._.TimeeditDAL(
            'https://se.timeedit.net/web/lnu/db1/schema1/',
            4
        );
    }

    /**
     * [module startFunctions]
     */
    init(){
        co(function* (){
            let settings = yield this.getSettings('hue');
            let lampSettings = this.getLampSettings(settings);
            let lampRoomIds = this.getRoomIdsFromLamps(lampSettings);
            let lampHueIds = this.getHueLampId(lampSettings);
            let moduleSettings = this.getModuleSettings(settings);
            this.setModuleVariables(moduleSettings);
            let roomSchedule = yield this.getTodaysRoomSchedule(lampRoomIds);

            return arrayHelper.concatArray(roomSchedule);
        }.bind(this))
            .then((bookings) => {
                return this.getNightmodePosible(bookings);
            }).then((roomIds) => {
                console.log(roomIds);
                this.nodeSchedules.push(
                    this.makeNodeSchedule(roomIds, this.nightmodeStartTime, this.nightmodeColor, 0));
                this.nodeSchedules.push(
                    this.makeNodeSchedule(roomIds, this.nightmodeEndTime, this.defaultColor, 254));
            }).catch((er) => {
                console.log(er);
            });
    }

    /**
     * [changes color of lamps]
     * @param  {[object]} props [properties for lamps]
     * @return {[type]}       [description]
     */
    runNightmode(props){
        this._.settings.getLampsinRoom(props.roomId)
            .then((lampsInRoom) => {
                lampsInRoom.forEach((lamp) => {
                    this._.lightHandler.changeColorWithHue(lamp.lampId,
                        props.color, 0);
                    this._.lightHandler.changeBrightness(lamp.lampId, props.brightness, 0);
                });
            });
    }

    /**
     * [builds node schedule]
     * @param  {[array]} roomIds  [array of roomIds]
     * @param  {[date]} time      [date object]
     * @param  {[int]} color      [color in hue]
     * @param  {[int]} brightness [brightness of lamp]
     * @return {[array]}          [array of nodeschedule events]
     */
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

    /**
     * [gets rooms ids of avaible rooms ]
     * @param  {[type]} bookings           [description]
     * @return {[array]}                    [array of roomIds]
     */
    getNightmodePosible(bookings){
        let mySet = new Set();
        let univibleRoomIds = bookings.filter(item => item.hasOwnProperty('booking'))
            .filter(item =>
                !this.isNightmodeStartPosible(
                    dateHelper.buildDateFromString(item.booking.time.endTime)))
            .map(item => item.booking.id);

        let bookedRooms = bookings.filter(item => item.hasOwnProperty('booking'))
            .filter(item =>
                this.isNightmodeStartPosible(
                    dateHelper.buildDateFromString(item.booking.time.endTime)))
            .filter(item => univibleRoomIds.indexOf(item.booking.id))
            .filter(item => {
                if(mySet.has(item.id)){ return false; }
                mySet.add(item.id);
                return true; })
            .map(item => { return { id:item.booking.id}; });

        let unBookedRooms = bookings.filter(item => !item.hasOwnProperty('booking'));
        return arrayHelper.mergeArrays(bookedRooms, unBookedRooms);
    }

    isNightmodeStartPosible(bookingEndTime, bookingStartTime){
        return bookingEndTime <= this.nightmodeStartTime;
    }

    /**
     * [sets nightmode variables global to this class]
     * @param {[object]} nightModeSettings [nightmode settings part of moduleSettings]
     */
    setModuleVariables(nightModeSettings){
        this.nightmodeStartTime = dateHelper.buildDateFromString(nightModeSettings.startTime);
        this.nightmodeEndTime = dateHelper.addDayToDate(1,
            dateHelper.buildDateFromString(nightModeSettings.endTime));

        this.nightmodeColor = nightModeSettings.startColor;
        this.defaultColor = nightModeSettings.endColor;
    }

    /**
     * [returns settings for module and lamp]
     * @param  {[string]} lampType [type of lamp]
     * @return {[promise]}         [promise of all settings]
     */
    getSettings(lampType){
        return Promise.all([
            this._.settings.getLamps(lampType),
            this.settingsModule.getModuleSettings(),
        ]);
    }

    getModuleSettings(settings){
        return settings[1].nightMode;
    }

    getLampSettings(array){
        return array[0];
    }

    getRoomIdsFromLamps(lamps){
        return lamps.map(lamp => lamp.roomId);
    }

    getHueLampId(lamps){
        return lamps.map(lamp => lamp.lampId);
    }

    /**
     * [fetches all settings]
     * @param  {[array]} ids [roomIds in array]
     * @return {[promise]}     [promise of settings objects]
     */
    getTodaysRoomSchedule(ids){
        return Promise.all(ids.map(id =>
            this.timeEdidApiLnu.getTodaysSchedule(id)));
    }
};

exports.run = function(functionLayer){
    return new Nightmode(functionLayer);
};
