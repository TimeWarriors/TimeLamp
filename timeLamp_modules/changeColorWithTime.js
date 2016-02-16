'use strict';
const co = require('co');
const colorSchedule = require('./myModule/colorSchedule.js');

const MyModule = class {
    constructor(s) {
        this._ = s;
        this.settingsModule = require('../settings/modulesettings.js');
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

            //this.setDefaultColor(lampIds, moduleSettings);
            return colorSchedule.getColorSchedule(roomSchedule, moduleSettings);
        }.bind(this))
            .then((colorSchedule) => {
                console.log(JSON.stringify(colorSchedule, null, 2));
                //this.makeNodeSchedule(colorSchedule);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    // TODO: missing seconds to change
    /**
     * [will call hue change color function]
     * @param  {[type]} object []
     */
    changeColor(object){
        console.log(object);

        this._.settings.getLampsinRoom(object.roomId)
            .then((lampsInRoom) => {
                lampsInRoom.forEach((lamps) => {
                    this._.lightHandler.changeColorWithHue(lamps.lampId, lamps.color);
                });
            }).catch((er) => {
                console.log(er);
            });
    }

    /**
     * [will book node schedules to run function at specific time]
     * @param  {[array]} roomSchedule [contains times to book node schedule on]
     * @return {[object]}       [node schedule events]
     */
    makeNodeSchedule(roomSchedule){
        return roomSchedule.map((booking) => {
            booking.colorSchedule.map((status) => {
                return this._.nodeSchedule.scheduleFunctionCallJob(
                    new Date(status.time),
                    this.changeColor.bind(this),
                    {color: status.color, roomId: booking.roomId}
                );
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
        return [
              [
                {
                  "booking": {
                    "time": {
                      "endDate": "2016-02-16",
                      "endTime": "12:45",
                      "startDate": "2016-02-16",
                      "startTime": "08:00"
                    },
                    "id": "ny105",
                    "bookingId": "305367",
                    "columns": [
                      "1DV023, NGWEC15h, NGWEC15h1",
                      "VT16-R0120-0121, HT15-61017, HT15-61018",
                      "Ny105K",
                      "Johan Leitet, John Häggerud, Mats Loock",
                      "",
                      "Föreläsning",
                      "",
                      "",
                      "https://connect.sunet.se/lecture-1dv023/"
                    ]
                  }
              },
              {
                "booking": {
                  "time": {
                    "endDate": "2016-02-16",
                    "endTime": "16:45",
                    "startDate": "2016-02-16",
                    "startTime": "16:00"
                  },
                  "id": "ny105",
                  "bookingId": "305367",
                  "columns": [
                    "1DV023, NGWEC15h, NGWEC15h1",
                    "VT16-R0120-0121, HT15-61017, HT15-61018",
                    "Ny105K",
                    "Johan Leitet, John Häggerud, Mats Loock",
                    "",
                    "Föreläsning",
                    "",
                    "",
                    "https://connect.sunet.se/lecture-1dv023/"
                  ]
                }
            },

            {
              "booking": {
                "time": {
                  "endDate": "2016-02-16",
                  "endTime": "19:30",
                  "startDate": "2016-02-16",
                  "startTime": "17:00"
                },
                "id": "ny105",
                "bookingId": "305367",
                "columns": [
                  "1DV023, NGWEC15h, NGWEC15h1",
                  "VT16-R0120-0121, HT15-61017, HT15-61018",
                  "Ny105K",
                  "Johan Leitet, John Häggerud, Mats Loock",
                  "",
                  "Föreläsning",
                  "",
                  "",
                  "https://connect.sunet.se/lecture-1dv023/"
                ]
              }
          },

          {
            "booking": {
              "time": {
                "endDate": "2016-02-16",
                "endTime": "21:45",
                "startDate": "2016-02-16",
                "startTime": "20:00"
              },
              "id": "ny105",
              "bookingId": "305367",
              "columns": [
                "1DV023, NGWEC15h, NGWEC15h1",
                "VT16-R0120-0121, HT15-61017, HT15-61018",
                "Ny105K",
                "Johan Leitet, John Häggerud, Mats Loock",
                "",
                "Föreläsning",
                "",
                "",
                "https://connect.sunet.se/lecture-1dv023/"
              ]
            }
        }

          ]
        ];


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
