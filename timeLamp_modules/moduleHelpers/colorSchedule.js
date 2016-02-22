'use strict';

const ColorSchedule = class  {
    constructor() {
        let C = require('../../colorTimeConverter/colorTimeConverter.js');
        this.colorTimeConverter = new C();
    }

    getColorTimeSchedule(roomSchedule, moduleSettings){
        let sortedSettings = this.sortSettingsOnTime(moduleSettings);
        let maxTimeVal = this.getMaxTimeValue(sortedSettings);

        let colorSchedule = roomSchedule.map((room) => {

            // not complete room object.
            if(!room[0].hasOwnProperty('booking')){ return null; }
            return this.isArrayLargerThanOne(room) ?
                this.compareBookingTimes(
                    room,
                    maxTimeVal,
                    sortedSettings) :
                this.buildSchedule(
                    room[0].booking.time.startTime,
                    room[0].booking.id,
                    sortedSettings,
                    room[0].booking.time.endTime
                );
        });
        return this.filterNull([].concat.apply([], colorSchedule));
    }

    /**
     * [removes null values from array's]
     */
    filterNull(arr){
        return arr.filter(i => i !== null);
    }

    /**
     * [check if array is larger than one]
     */
    isArrayLargerThanOne(arr){
        return arr.length >= 2;
    }

    /**
     * [build colorSchedule for a booking]
     * @return {[object]}    [colorSchedule for a booking]
     */
    buildSchedule(time, id, avalibleTimes, endTime){
        return {
            colorSchedule: this.timeBuilder(time, avalibleTimes),
            roomId: id,
            startTime: this.buildDate(time),
            endTime: this.buildDate(endTime)
        };
    }

    /**
     * [compares a booking with a booking before it and build a colorSchedule for it]
     * @param  {[array]} room           [contains booking for that room]
     * @param  {[int]} maxTimeVal     [time in minutes]
     * @param  {[array]} sortedSettings [settings for module]
     * @return {[array]}                [colorSchedule for room bookings]
     */
    compareBookingTimes(room, maxTimeVal, sortedSettings){
        let colorSchedule = [];
        let lastElement = null;
        room.reduceRight((prev, current, index, array) => {
            if(prev === null){ return current; }
            let endTime = current.booking.time.endTime;
            let startTime = prev.booking.time.startTime;
            let prevEndTime = prev.booking.time.endTime;

            lastElement = this.buildSchedule(current.booking.time.startTime, current.booking.id, sortedSettings, current.booking.time.endTime);
            if(this.isFullIntervall(startTime, maxTimeVal, endTime)){
                colorSchedule.push(
                    this.buildSchedule(startTime, prev.booking.id, sortedSettings, prevEndTime)
                );
            }else{

                let timeBetweenDates = this.getTimeBetweenDates(startTime, endTime);
                let timeSchedule = this.addTimeToArray(sortedSettings, timeBetweenDates);
                let avalibleTimes = this.getAllTimesAfter(timeSchedule, timeBetweenDates);
                colorSchedule.push(
                    this.buildSchedule(startTime, prev.booking.id, avalibleTimes, prevEndTime)
                );
            }
            return current;
        }, null);
        colorSchedule.push(lastElement);
        return this.endTimeBuilder(colorSchedule.reverse(), maxTimeVal);
    }

    /**
     * [adds new time value and color to array if it dont exsists]
     * @param {[array]} avalibleTimes [array of times and colors]
     * @param {[int]} a             [time to add to array]
     * @return {[array]}            [alterd array]
     */
    addTimeToArray(avalibleTimes, a){
        let first = {time: 0, color: null};
        let last = {time: 0, color: null};
        var tempArray = avalibleTimes.slice(0);
        avalibleTimes.forEach((item) => {
            if(a > item.time && last.item < item.time){
                last = item;
            }else if(a < item.time && first.time < item.time){
                first = item;
            }
        });
        let onlyDuplicates = avalibleTimes.filter((item) => {
            return item.time === a;
        });

        if(onlyDuplicates.length <= 0 && first.time !== 0){
            let aColor = this.colorTimeConverter.getColor(
                    first.time, last.time, a, first.color, last.color);
            tempArray.push({ time: a, color: Math.floor(aColor), fade: true});
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

    /**
     * [checks if maxTimeVal is bigger than the difference between startTime and endTime ]
     * @param  {[string]}  startTime    [start time of a block]
     * @param  {[int]}  maxTimeVal [time in minutes]
     * @param  {[string]}  endTime [end time of a block]
     * @return {Boolean}         [returns if maxtimeVal i smaller than time dif]
     */
    isFullIntervall(startTime, maxTimeVal, endTime){
        return this.getTimeBetweenDates(startTime, endTime) >= maxTimeVal;
    }

    /**
     * [returns the time between two dates]
     * @param  {[string]} startTime    [time in string]
     * @param  {[string]} endTime [time in string]
     * @return {[int]}         [time between dates]
     */
    getTimeBetweenDates(startTime, endTime, startDif, endDif){
        if(startTime instanceof Date &&
        endTime instanceof Date){
        }else{
            startTime = this.buildDate(startTime, startDif);
            endTime = this.buildDate(endTime, endDif);
        }
        return (startTime.getTime() - endTime.getTime())/1000/60;
    }

    /**
     * [make color schedule object]
     * @param  {[string]} startTime     [start time for booking]
     * @param  {[array]} avalibleTimes [all the working times]
     * @return {[array]}               [array pf color schedule objects]
     */
    timeBuilder(startTime, avalibleTimes){
        let scheduleObject = [];
        var tempArray = avalibleTimes.slice(0);
        tempArray[tempArray.length] = tempArray[tempArray.length-1];
        tempArray.reduce((prev, current, index, array) => {
            scheduleObject.push(
                this.timeObject(
                    this.buildDate(startTime, prev.time),
                    prev.color,
                    prev.fade,
                    prev.emit,
                    (this.addMinuteToDate(prev.time).getTime() -
                        this.addMinuteToDate(current.time).getTime())/1000/60,
                    prev.time
                )
            );
            return current;
        });
        return scheduleObject;
    }

    /**
     * [holds the colorSchedule object]
     * */
    timeObject(time, color, fade, emit, timeDif, timeFromStart){
        return {
            time,
            color,
            fade,
            emit: emit ? `time_${timeFromStart}` : false,
            timeDif
        };
    }

    /**
     * [creates endTime ColorSchedule for bookings]
     * @return {[array]}               [colorSchedule with end times]
     */
    endTimeBuilder(colorSchedule, maxTimeVal){
        let lastElement;
        colorSchedule.reduce((prev, current, index, array) => {
            let prevEndTime = prev.endTime;
            let currentStartTime = current.startTime;
            let currentEndTime = current.endTime;
            lastElement = this.timeObject(
                currentEndTime,
                10,
                false,
                true,
                null,
                'bookingEnd'
            );
            if(this.isFullIntervall(currentStartTime, maxTimeVal, prevEndTime)){
                prev.colorSchedule.push(
                    this.timeObject(
                        prevEndTime,
                        10,
                        false,
                        true,
                        null,
                        'bookingEnd'
                    )
                );
            }
            return current;
        });
        colorSchedule[colorSchedule.length-1].colorSchedule.push(lastElement);
        return colorSchedule;
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
