'use strict';

const ColorSchedule = class  {
    constructor() {
        let C = require('../../colorTimeConverter/colorTimeConverter.js');
        this.colorTimeConverter = new C();
    }


    getColorSchedule(roomSchedule, moduleSettings){
        let sortedSettings = this.sortSettingsOnTime(moduleSettings);
        let maxTimeVal = this.getMaxTimeValue(sortedSettings);
        let colorSchedule = [];
        roomSchedule.forEach((room) => {
            if(this.isArrayLargerThanOne(room)){
                colorSchedule.push(
                    this.buildSchedule(
                        room[0].booking.time.startTime,
                        room[0].booking.id,
                        sortedSettings
                    )
                );
            }else{
                colorSchedule.push(
                    this.compareBookings(room, maxTimeVal, sortedSettings)
                );
            }
        });

        return colorSchedule;
    }

    isArrayLargerThanOne(arr){
        return arr.length <= 1;
    }

    buildSchedule(time, id, sortedSettings){
        return {
            colorSchedule: this.timeBuilder(time, sortedSettings),
            roomId: id
        };
    }

    compareBookings(room, maxTimeVal, sortedSettings){
        let colorSchedule = [];
        let lastElement;
        room.reduceRight((prev, current, index, array) => {
            if(prev === null){ return current; }
            let endTime = current.booking.time.endTime;
            let startTime = prev.booking.time.startTime;

            lastElement = this.buildSchedule(current.booking.time.startTime, current.booking.id, sortedSettings);
            if(this.isFullIntervall(startTime, maxTimeVal, endTime)){
                colorSchedule.push(
                    this.buildSchedule(startTime, prev.booking.id, sortedSettings)
                );
            }else{
                let timeBetweenDates = this.getTimeBetweenDates(startTime, endTime);
                let timeSchedule = this.addTimeToArray(sortedSettings, timeBetweenDates);
                let avalibleTimes = this.getAllTimesAfter(timeSchedule, timeBetweenDates);
                colorSchedule.push(
                    this.buildSchedule(startTime, prev.booking.id, avalibleTimes)
                );
            }
            return current;
        }, null);
        colorSchedule.push(lastElement);
        return colorSchedule;
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
        var tempArray = avalibleTimes.slice(0);
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
        let f = avalibleTimes.filter((item) => {
            return item.time === a;
        });

        if(f.length <= 0 && first.time !== 0){
            let aColor = this.colorTimeConverter.getColor(
                    first.time, last.time, a, first.color, last.color);
            tempArray.push({ time: a, color: Math.floor(aColor) });
        }

        return this.sortSettingsOnTime(tempArray);
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