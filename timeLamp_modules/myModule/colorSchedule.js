'use strict';

const ColorSchedule = class  {
    constructor() {
        let C = require('../../colorTimeConverter/colorTimeConverter.js');
        this.colorTimeConverter = new C();
    }

    // TODO: make this prettier!!
    getColorSchedule(roomSchedule, moduleSettings){
        let sortedSettings = this.sortSettingsOnTime(moduleSettings);
        let maxTimeVal = this.getMaxTimeValue(sortedSettings);
        let s = roomSchedule.map((room) => {
            let schedule = [];

            let roomReverse = room.reverse();

            // quick fix
            if(roomReverse.length <= 1){
                schedule.push({
                    colorSchedule: this.timeBuilder(roomReverse[0].booking.time.startTime, sortedSettings),
                    roomId: roomReverse[0].booking.id
                });
                return schedule;
            }
            for (var i = 0; i < roomReverse.length; i++) {
                let prev = room[i];
                let current = room[i+1] ? room[i+1] : null;

                if(current === null) { break; }

                if(this.isFullIntervall(prev.booking.time.startTime, maxTimeVal,
                    current.booking.time.endTime)){
                        schedule.push({
                            colorSchedule: this.timeBuilder(prev.booking.time.startTime, sortedSettings),
                            roomId: prev.booking.id
                        });
                }else{
                    let timeBetweenDates = this.getTimeBetweenDates(prev.booking.time.startTime,
                        current.booking.time.endTime);
                    let timeSchedule = this.addTimeToArray(sortedSettings, timeBetweenDates);
                    let avalibleTimes = this.getAllTimesAfter(timeSchedule, timeBetweenDates);

                    schedule.push({
                        colorSchedule: this.timeBuilder(prev.booking.time.startTime, avalibleTimes),
                        roomId: prev.booking.id
                    });
                }
            }
            return schedule;
        });

        let flattenArray = s.reduce((previous, current) => {
            return previous.concat(current);
        }, []);
        return flattenArray;
    }

    /**
     * [adds new time value and color to array]
     * @param {[array]} avalibleTimes [array of times and colors]
     * @param {[int]} a             [time to add to array]
     * @return {[array]}            [alterd array]
     */
    addTimeToArray(avalibleTimes, a){
        let first = {time: 0, color: null};
        let last = {time: 0, color: null};
        avalibleTimes.forEach((item) => {
            if(a > item.time){
                if(last.time < item.time){
                    last = item;
                }
            }else if(a < item.time){
                if(first.time < item.time){
                    first = item;
                }
            }
        });
        let aColor = this.colorTimeConverter.getColor(
                first.time, last.time, a, first.color, last.color);

        avalibleTimes.push({ time: a, color: Math.floor(aColor) });
        return this.sortSettingsOnTime(avalibleTimes);
    }

    /**
     * [returns all values after 'removeAfter']
     * @param  {[object]} moduleSettings [settings for module]
     * @param  {[int]} removeAfter    []
     * @return {[array]}                [alterd array]
     */
    getAllTimesAfter(moduleSettings, removeAfter){
        return moduleSettings.filter((setting) => {
            return setting.time <= removeAfter;
        });
    }

    /**
     * [sorts array biggest to smalest]
     * @param  {[object]} moduleSettings [settings for module]
     * @return {[array]}                [sorted array]
     */
    sortSettingsOnTime(moduleSettings){
        return moduleSettings
            .sort((a, b) => {
                return b.time - a.time;
            });
    }

    /**
     * [max value in module settings]
     * @param  {[object]} moduleSettings [settings for modules]
     * @return {[int]}                [largest value of time in file]
     */
    getMaxTimeValue(moduleSettings){
        let prevTime = 0;
        moduleSettings.forEach((setting) => {
            if(setting.time > prevTime){
                prevTime = setting.time;
            }
        });
        return prevTime;
    }

    isFullIntervall(prev, timeDif, current){
        prev = this.buildDate(prev, timeDif);
        current = this.buildDate(current);

        let minutes = (prev.getTime() - current.getTime())/1000/60;
        return minutes >= timeDif;
    }

    /**
     * [returns the time between two dates]
     * @param  {[string]} prev    [time in string]
     * @param  {[string]} current [time in string]
     * @return {[int]}         [time between dates]
     */
    getTimeBetweenDates(prev, current){
        prev = this.buildDate(prev);
        current = this.buildDate(current);
        return (prev.getTime() - current.getTime())/1000/60;
    }

    /**
     * [make color schedule object]
     * @param  {[string]} startTime     [start time for booking]
     * @param  {[array]} avalibleTimes [all the working times]
     * @return {[array]}               [array pf color schedule objects]
     */
    timeBuilder(startTime, avalibleTimes){
        return avalibleTimes.map((a) => {
            return {
                time: this.buildDate(startTime, a.time),
                color: a.color
            };
        });
    }

    splitTime(timeString){
        return timeString.split(':');
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
};

module.exports = new ColorSchedule();
