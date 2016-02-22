'use strict';
const co = require('co');
const colorSchedule = require('./moduleHelpers/colorSchedule.js');

const MyModule = class {
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
     * [module start function]
     */
    init(){
        co(function* (){
            this.removeNodeScheduleEvents(this.nodeSchedules);

            let settings = yield this.getSettings('hue');
            let moduleSettings = this.getModuleSettings(settings);
            let lampSettings = this.getLampSettings(settings);
            let lampIds = this.getIdsFromLamps(lampSettings);
            let roomSchedule = yield this.getTodaysRoomSchedule(lampIds);

            this.setDefaultColor(lampIds, moduleSettings.roomAvalibleColor);
            return colorSchedule.getColorTimeSchedule(roomSchedule, moduleSettings.preRoomBookingTimes, moduleSettings.roomAvalibleColor);
        }.bind(this))
            .then((colorTimeSchedule) => {
                this.nodeSchedules = this.makeNodeSchedule(colorTimeSchedule);
            })
            .catch((e) => {
                throw e;
            });
    }

    /**
     * [will call hue change color function]
     * @param  {[type]} object []
     */
    changeColor(properties){
        this._.settings.getLampsinRoom(properties.roomId)
            .then((lampsInRoom) => {
                lampsInRoom.forEach((lamps) => {
                    if(properties.emit !== false){ this.emittTimes(properties); }

                    return properties.fade ?
                        this._.lightHandler.changeColorWithHue(lamps.lampId,
                            properties.color,
                            this.convertMinutesToSeconds(properties.timeDif)
                        ) :
                        this._.lightHandler.changeColorWithHue(lamps.lampId,
                            properties.color, 0);
                });
            }).catch((er) => {
                console.log(er);
            });
    }

    emittTimes(properties){
        this._.emitter.emit(properties.emit, properties);
    }

    convertMinutesToSeconds(time){
        return time*60;
    }

    /**
     * [will book node schedules to run function at specific time]
     * @param  {[array]} roomSchedule [contains times to book node schedule on]
     * @return {[object]}       [node schedule events]
     */
    makeNodeSchedule(roomColorTimeSchedule){
        return roomColorTimeSchedule.map((booking) => {
            return booking.colorSchedule.map((status) => {
                return this._.nodeSchedule.scheduleFunctionCallJob(
                    new Date(status.time),
                    this.changeColor.bind(this),{
                        color: status.color,
                        roomId: booking.roomId,
                        timeDif: status.timeDif,
                        fade: status.fade,
                        emit: status.emit
                    }
                );
            });
        });
    }

    /**
     * [removes all scheduled events]
     * @param  {[array]} nodeScheduleEvents [array of scheduled events]
     */
    removeNodeScheduleEvents(nodeScheduleEvents){
        if(!Array.isArray(nodeScheduleEvents)){
            throw 'nodeSchedule not array';
        }
        nodeScheduleEvents.forEach((jobCollections) => {
            try {
                jobCollections.forEach((job) => {
                    try {
                        job.cancel();
                    } catch (e) {}
                });
            } catch (e) {}
        });

    }

    /**
     * [returns settings for module and lamp]
     * @param  {[string]} lampType [type of lamp]
     * @return {[promise]}          [promise of all settings]
     */
    getSettings(lampType){
        return Promise.all([
            this._.settings.getLamps(lampType),
            this.settingsModule.getModuleSettings(),
        ]);
    }

    /**
     * [retrives id from lamb object]
     * @param  {[object]} lamps [collection of lamps]
     * @return {[object]}       [collection of Id's]
     */
    getIdsFromLamps(lamps){
        return lamps.map(lamp => lamp.roomId);
    }

    getModuleSettings(settings){
        return settings[1];
    }

    getLampSettings(settings){
        return settings[0];
    }

    /**
     * [returns room schedule]
     * @return {[object]} [room schedule]
     */
    getTodaysRoomSchedule(ids){
        return Promise.all(ids.map(id =>
            this.timeEdidApiLnu.getTodaysSchedule(id)));
    }

    /**
     * [sets the default color for lapms]
     * @param {[array]} lamps          [array of lamp objects]
     * @param {[object]} moduleSettings [settings object for this module]
     */
    setDefaultColor(lampIds, defaultColor){
        lampIds.forEach(lampId =>
            this._.lightHandler.changeColorWithHue(lampId, defaultColor, 0)
        );
    }
};

exports.run = function(functionLayer){
    return new MyModule(functionLayer);
};
