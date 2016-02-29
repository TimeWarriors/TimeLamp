'use strict';


const ColorSchedule = class {
    constructor() {
        this.dateHelper = require('./dateHelper.js');
        this.arrayHelper = require('./arrayHelper.js');
        const C = require('../../colorTimeConverter/colorTimeConverter.js');
        this.colorTimeConverter = new C();
    }

    getColorTimeSchedule(roomSchedule, roomBookingTimes, avalibleColor){
        let sortedRoomBookingTimes = this.sortRoomBookingOnTime(roomBookingTimes);
        let maxTimeVal = this.getMaxTimeValue(sortedRoomBookingTimes);

        let colorSchedule = roomSchedule.map((room) => {
            // incomplete room object
            if(!room[0].hasOwnProperty('booking')){ return null; }
            return this.arrayHelper.isArrayLargerThanOne(room) ?
                this.compareBookingTimes(
                    room,
                    maxTimeVal,
                    sortedRoomBookingTimes) :
                [this.buildSchedule(
                    this.dateHelper.buildDateFromString(
                        room[0].booking.time.startTime),
                    room[0].booking.id,
                    sortedRoomBookingTimes,
                    this.dateHelper.buildDateFromString(
                        room[0].booking.time.endTime)
                )];
        });
        return this.arrayHelper.concatArray(
                this.endTimeBuilder(
                    this.arrayHelper.filterNull(colorSchedule), maxTimeVal, avalibleColor));
    }

    /**
     * [build colorSchedule for a booking]
     * @return {[object]}    [colorSchedule for a booking]
     */
    buildSchedule(time, id, avalibleTimes, endTime){
        return {
            colorSchedule: this.timeBuilder(time, avalibleTimes),
            roomId: id,
            startTime: time,
            endTime: endTime
        };
    }

    /**
     * [sorts array biggest to smalest]
     * @param  {[object]} roomBookingTimes [settings for module]
     * @return {[array]}                [sorted array]
     */
    sortRoomBookingOnTime(roomBookingTimes){
        return roomBookingTimes
            .sort((a, b) => {
                return b.time - a.time;
            });
    }

    /**
     * [max value in module settings]
     * @param  {[object]} sortedRoomBookingTimes [settings for modules]
     * @return {[int]}                [largest value of time in file]
     */
    getMaxTimeValue(sortedRoomBookingTimes){
        return this.sortRoomBookingOnTime(sortedRoomBookingTimes)[0].time;
    }

    /**
     * [compares a booking with a booking before it and build a colorSchedule for it]
     * @param  {[array]} room           [contains booking for that room]
     * @param  {[int]} maxTimeVal     [time in minutes]
     * @param  {[array]} sortedSettings [settings for module]
     * @return {[array]}                [colorSchedule for room bookings]
     */
    compareBookingTimes(room, maxTimeVal, avalibleTimes){
        let colorSchedule = [];
        let lastElement;

        room.reduceRight((prev, current, index, array) => {
            if(prev === null){ return current; }
            let currentStartTime = this.dateHelper.buildDateFromString(current.booking.time.startTime);
            let currentEndTime = this.dateHelper.buildDateFromString(current.booking.time.endTime);
            let prevStartTime = this.dateHelper.buildDateFromString(prev.booking.time.startTime);
            let prevEndTime = this.dateHelper.buildDateFromString(prev.booking.time.endTime);

            lastElement = this.buildSchedule(currentStartTime, current.booking.id, avalibleTimes, currentEndTime);
            if(this.isFullIntervall(prevStartTime, currentEndTime, maxTimeVal)){
                colorSchedule.push(
                    this.buildSchedule(prevStartTime, prev.booking.id, avalibleTimes, prevEndTime)
                );
            }else{
                let timeBetweenDates = this.dateHelper.getTimeBetweenDates(prevStartTime, currentEndTime);
                let timeSchedule = this.addTimeToArray(avalibleTimes, timeBetweenDates);
                let newAvalibleTimes = this.getAllTimesAfter(timeBetweenDates, timeSchedule);
                colorSchedule.push(
                    this.buildSchedule(prevStartTime, prev.booking.id, newAvalibleTimes, prevEndTime)
                );
            }
            return current;
        }, null);
        colorSchedule.push(lastElement);
        return colorSchedule.reverse();
    }

    /**
     * [checks if maxTimeVal is bigger than the difference between a and b ]
     * @param  {[date]}  a    [date object]
     * @param  {[date]}  b    [date object]
     * @param  {[int]}  maxTimeVal [time in minutes]
     * @return {Boolean}         [returns if maxtimeVal i smaller than time dif]
     */
    isFullIntervall(a, b, maxTimeVal){
        return this.dateHelper.getTimeBetweenDates(a, b) >= maxTimeVal;
    }

    /**
     * [adds new time value and color to array if it dont exsists]
     * @param {[array]} avalibleTimes [array of times and colors]
     * @param {[int]} a             [time to add to array]
     * @return {[array]}            [alterd array]
     */
    addTimeToArray(avalibleTimes, time){
        let first = {time: 0, color: null};
        let last = {time: 0, color: null};
        var tempArray = this.arrayHelper.copyArray(avalibleTimes);
        avalibleTimes.forEach((item) => {
            if(time > item.time && last.item < item.time){
                last = item;
            }else if(time < item.time && first.time < item.time){
                first = item;
            }
        });
        let onlyDuplicates = avalibleTimes.filter((item) => {
            return item.time === time;
        });

        if(onlyDuplicates.length <= 0 && first.time !== 0){
            let aColor = this.colorTimeConverter.getColor(
                    first.time, last.time, time, first.color, last.color);
            tempArray.push({ time: time, color: Math.floor(aColor), fade: true});
        }
        return this.sortRoomBookingOnTime(tempArray);
    }

    /**
     * [returns all values after 'removeAfter']
     * @param  {[int]} removeAfter    []
     * @param  {[object]} moduleSettings [array with time objects]
     * @return {[array]}                [alterd array]
     */
    getAllTimesAfter(removeAfter, timeSchedule){
        return timeSchedule.filter(i => i.time <= removeAfter);
    }

    /**
     * [make color schedule object]
     * @param  {[string]} startTime     [start time for booking]
     * @param  {[array]} avalibleTimes [all the working times]
     * @return {[array]}               [array pf color schedule objects]
     */
    timeBuilder(startTime, avalibleTimes){
        let scheduleObject = [];
        var tempArray = this.arrayHelper.copyArray(avalibleTimes);
        tempArray[tempArray.length] = tempArray[tempArray.length-1];
        tempArray.reduce((prev, current, index, array) => {
            scheduleObject.push(
                this.timeObject(
                    this.dateHelper.subtractTime(startTime, prev.time),
                    prev.color,
                    current.color,
                    prev.fade,
                    prev.pulse,
                    prev.emit,
                    this.dateHelper.getTimeBetweenDates(
                        this.dateHelper.addMinuteToDate(prev.time),
                        this.dateHelper.addMinuteToDate(current.time)),
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
    timeObject(time, color, nextColor, fade, pulse, emit, timeDif, timeFromStart){
        return {
            time,
            color,
            nextColor,
            fade,
            pulse,
            emit: emit ? `time_${timeFromStart}` : false,
            timeDif,
            timeFromStart
        };
    }

    /**
     * [creates endTime ColorSchedule for bookings]
     * @return {[array]}               [colorSchedule with end times]
     */
    endTimeBuilder(roomsColorSchdule, maxTimeVal, avalibleColor){
        let lastElement;
        roomsColorSchdule.forEach((room) => {
            if(!this.arrayHelper.isArrayLargerThanOne(room)){
                lastElement = this.timeObject(
                    room[0].endTime,
                    avalibleColor,
                    avalibleColor,
                    false,
                    false,
                    true,
                    null,
                    'bookingEnd'
                );
                room[room.length-1].colorSchedule.push(lastElement);
                return;
            }
            room.reduce((prev, current, index, array) => {
                let prevEndTime = prev.endTime;
                let currentStartTime = current.startTime;
                let currentEndTime = current.endTime;
                lastElement = this.timeObject(
                    currentEndTime,
                    avalibleColor,
                    avalibleColor,
                    false,
                    false,
                    true,
                    null,
                    'bookingEnd'
                );
                if(this.isFullIntervall(currentStartTime, prevEndTime, maxTimeVal)){
                    prev.colorSchedule.push(
                        this.timeObject(
                            prevEndTime,
                            avalibleColor,
                            avalibleColor,
                            false,
                            false,
                            true,
                            null,
                            'bookingEnd'
                        )
                    );
                }
                return current;
            });
            room[room.length-1].colorSchedule.push(lastElement);
        });
        return roomsColorSchdule;
    }
};

module.exports = new ColorSchedule();
