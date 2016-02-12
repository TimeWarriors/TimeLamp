'use strict';

const fakeSettings = {

};

const co = require('co');
const colorSchedule = require('./myModule/changeColorSchedule.js');

const MyModule = class {
    constructor(s) {

        this.settingsModule = require('../settings/modulesettings.js');
        this._ = s;
        this.timeEdidApiLnu = new this._.TimeeditDAL(
                'https://se.timeedit.net/web/lnu/db1/schema1/',
                4
            );

    }

    init(){
        co(function* (){
            let settings = yield this.getSettings('hue');
            let moduleSettings = this.getModuleSettings(settings);

            let lampSettings = this.getLampSettings(settings);
            let lampIds = this.getIdsFromLamps(lampSettings);

            let roomSchedule = yield this.getTodaysRoomSchedule(lampIds);
            this.setDefaultColor(lampIds, moduleSettings);

            //console.log(JSON.stringify(roomSchedule, null, 2));
            return roomSchedule;
        }.bind(this))
            .then((roomSchedule) => {
                let colorSchedule = this.getColorSchedule(roomSchedule);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    /**********/

    /********/

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
        const fakeSchedule = [
                  [
                    {
                      "booking": {
                        "time": {
                          "endDate": "2016-02-11",
                          "endTime": "10:00",
                          "startDate": "2016-02-11",
                          "startTime": "08:00"
                        },
                        "id": "ny160",
                        "bookingId": "309120",
                        "columns": [
                          "1MP104, MGJOM15h",
                          "VT16-R0832, HT15-51017",
                          "Ny167K",
                          "",
                          "JOM15A",
                          "Lektion",
                          "1MP104 TV/Video I - Gestaltande produktion",
                          "",
                          ""
                        ]
                      }
                  },
                  {
                    "booking": {
                      "time": {
                        "endDate": "2016-02-11",
                        "endTime": "15:00",
                        "startDate": "2016-02-11",
                        "startTime": "13:00"
                      },
                      "id": "ny160",
                      "bookingId": "309121",
                      "columns": [
                        "1MP104, MGJOM15h",
                        "VT16-R0832, HT15-51017",
                        "Ny167K",
                        "",
                        "JOM15A",
                        "Lektion",
                        "1MP104 TV/Video I - Gestaltande produktion",
                        "",
                        ""
                      ]
                    }
                    },
                    {
                      "booking": {
                        "time": {
                          "endDate": "2016-02-11",
                          "endTime": "18:00",
                          "startDate": "2016-02-11",
                          "startTime": "16:00"
                        },
                        "id": "ny160",
                        "bookingId": "309122",
                        "columns": [
                          "1MP104, MGJOM15h",
                          "VT16-R0832, HT15-51017",
                          "Ny167K",
                          "",
                          "JOM15A",
                          "Lektion",
                          "1MP104 TV/Video I - Gestaltande produktion",
                          "",
                          ""
                        ]
                      }
                    }
                ]
            ];

        return fakeSchedule;
        /*return Promise.all(ids.map(id =>
            this.timeEdidApiLnu.getTodaysSchedule(id)));*/
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
