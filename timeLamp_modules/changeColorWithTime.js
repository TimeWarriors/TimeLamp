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
            let lampRoomIds = this.getRoomIdsFromLamps(lampSettings);
            let lampHueIds = this.getHueLampId(lampSettings);
            let roomSchedule = yield this.getTodaysRoomSchedule(lampRoomIds);
            let colorTimeSchedule = colorSchedule.getColorTimeSchedule(
                roomSchedule,
                moduleSettings.preRoomBookingTimes,
                moduleSettings.roomAvalibleColor,
                moduleSettings.roomOccupiedColor);
            yield this.setDefaultColor(
                lampSettings,
                moduleSettings.roomAvalibleColor,
                colorTimeSchedule,
                moduleSettings.preRoomBookingTimes);

            return colorTimeSchedule;
        }.bind(this))
            .then((colorTimeSchedule) => {
                this.nodeSchedules = this.makeNodeSchedule(colorTimeSchedule);
            })
            .catch((e) => {
                console.error(e.stack);
            });
    }

    /**
     * [will call hue change color functions, warning, fade and normal changes]
     * @param  {[type]} object []
     */
    changeColor(properties){
        if(properties.emit){ this.emittTimes(properties); }
        this._.settings.getLampsinRoom(properties.roomId)
            .then((lampsInRoom) => {
                lampsInRoom.forEach((lamps) => {
                    if(properties.pulse){
                        return this._.lightHandler.changeColorWithHue(lamps.lampId,
                            properties.color, 0).then(() => {
                                this._.lightHandler.setWarning(
                                    lamps.lampId, 1000,
                                    this.convertMinutesToSeconds(properties.timeDif),
                                    properties.color
                                );
                            });
                    }
                    return properties.fade ?
                        this._.lightHandler.changeColorWithHue(lamps.lampId,
                            properties.color, 0).then(() => {
                                this._.lightHandler.changeColorWithHue(lamps.lampId,
                                    properties.nextColor,
                                    this.convertMinutesToSeconds(properties.timeDif)
                                );
                            }) :
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
                        nextColor: status.nextColor,
                        roomId: booking.roomId,
                        timeDif: status.timeDif,
                        fade: status.fade,
                        pulse: status.pulse,
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
    getRoomIdsFromLamps(lamps){
        return lamps.map(lamp => lamp.roomId);
    }

    getHueLampId(lamps){
        return lamps.map(lamp => lamp.lampId);
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
    setDefaultColor(lampSettings, defaultColor, colorTimeSchedule, roomBookingTimes){
        let timeNow = new Date();
        const changeColor = (booking) => {
            lampSettings.forEach(lamp => {
                if(booking.roomId === lamp.roomId){
                    this._.lightHandler.changeColorWithHue(lamp.lampId, booking.startColor, 0);
                }
            });
        };
        return new Promise((resolve, reject) => {
            Promise.all(lampSettings.map(lamp =>
                this._.lightHandler.changeColorWithHue(lamp.lampId, defaultColor, 0)))
                .then(result => {
                    colorTimeSchedule.filter(booking => timeNow > booking.colorSchedule[0].time && timeNow < booking.endTime)
                        .forEach(booking => changeColor(booking));
                    resolve(true);
                }).catch(er => {
                    reject(er);
                });
        });
    }
};

exports.run = function(functionLayer){
    return new MyModule(functionLayer);
};
