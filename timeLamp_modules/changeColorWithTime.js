'use strict';
const co = require('co');
const colorSchedule = require('./myModule/colorSchedule.js');

const MyModule = class {
    constructor(s) {
        this._ = s;
        this.nodeSchedules = [];
        this.settingsModule = require('../settings/modulesettings.js');
        this.timeEdidApiLnu = new this._.TimeeditDAL(
                'https://se.timeedit.net/web/lnu/db1/schema1/',
                4
            );

    }

    init(){
        co(function* (){
            this.removeNodeScheduleEvents(this.nodeSchedules);

            let settings = yield this.getSettings('hue');
            let moduleSettings = this.getModuleSettings(settings);
            let lampSettings = this.getLampSettings(settings);
            let lampIds = this.getIdsFromLamps(lampSettings);
            let roomSchedule = yield this.getTodaysRoomSchedule(lampIds);

            this.setDefaultColor(lampIds, moduleSettings);
            return colorSchedule.getColorSchedule(roomSchedule, moduleSettings);
        }.bind(this))
            .then((colorSchedule) => {
                this.nodeSchedules = this.makeNodeSchedule(colorSchedule);
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
                    if(properties.fade === false){
                        if(properties.emit !== false){ this.emittTimes(properties); }
                        return this._.lightHandler.changeColorWithHue(lamps.lampId, properties.color, 0);
                    }
                    return this._.lightHandler.changeColorWithHue(lamps.lampId, properties.color, (properties.timeDif*60));
                });
            }).catch((er) => {
                console.log(er);
            });
    }

    emittTimes(properties){
        this._.emitter.emit(properties.emit, properties);
    }

    /**
     * [will book node schedules to run function at specific time]
     * @param  {[array]} roomSchedule [contains times to book node schedule on]
     * @return {[object]}       [node schedule events]
     */
    makeNodeSchedule(roomColorSchedule){
        return roomColorSchedule.map((booking) => {
            return booking.colorSchedule.map((status) => {
                return this._.nodeSchedule.scheduleFunctionCallJob(
                    new Date(status.time),
                    this.changeColor.bind(this),
                    { color: status.color, roomId: booking.roomId,
                        timeDif: status.timeDif, fade: status.fade, emit: status.emit }
                );
            });
        });
    }

    removeNodeScheduleEvents(nodeScheduleEvents){
        if(!Array.isArray(nodeScheduleEvents)){
            throw 'nodeSchedule not array';
        }
        nodeScheduleEvents.forEach((jobCollections) => {
            if(!Array.isArray(jobCollections)){
                throw 'jobCollections not array';
            }
            jobCollections.forEach((job) => {
                try {
                    job.cancel();
                } catch (e) {

                }
            });
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
    setDefaultColor(lampIds, moduleSettings){
        lampIds.forEach(lampId =>
            this._.lightHandler.changeColor(lampId, moduleSettings.defaltColor[0],
                moduleSettings.defaltColor[1], moduleSettings.defaltColor[2])
        );
    }
};

exports.run = function(s){
    return new MyModule(s);
};
