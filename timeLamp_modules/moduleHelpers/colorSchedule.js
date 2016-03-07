'use strict';
const arrayHelper = require('./arrayHelper.js');
const dateHelper = require('./dateHelper.js');
// TODO: refactor this class to make it more understandible and smaler!s
const ColorSchedule = class {
    constructor() {
        const C = require('../../colorTimeConverter/colorTimeConverter.js');
        this.colorTimeConverter = new C();
        this.roomOccupiedColor = false;
        this.avalibleColor = false;
    }

    getColorTimeSchedule(roomSchedule, roomBookingTimes, avalibleColor, roomOccupiedColor){
        this.roomOccupiedColor = roomOccupiedColor;
        this.avalibleColor = avalibleColor;
        let sortedRoomBookingTimes = this.sortRoomBookingOnTime(roomBookingTimes);
        let maxTimeVal = this.getMaxTimeValue(sortedRoomBookingTimes);
        // valid rooms
        let validRoomSchedule = roomSchedule.filter(room =>
            room[0].hasOwnProperty('booking'));
        // single booking per room
        let singleBookings = validRoomSchedule.filter(room => !arrayHelper.isArrayLargerThanOne(room))
            .map(room => {
                return [this.buildSchedule(
                    dateHelper.buildDateFromString(room[0].booking.time.startTime),
                    room[0].booking.id,
                    sortedRoomBookingTimes,
                    dateHelper.buildDateFromString(room[0].booking.time.endTime)
                )];
            });
        // multible bookings per room
        let multibleBookings = validRoomSchedule.filter(room => arrayHelper.isArrayLargerThanOne(room))
            .map(room =>
                this.compareBookingTimes(room, maxTimeVal, sortedRoomBookingTimes));
        // add start color
        let startColor = this.getStartColor(arrayHelper.mergeArrays(
                multibleBookings, singleBookings));

        return arrayHelper.concatArray(
                this.endTimeBuilder(
                    startColor,
                    maxTimeVal, avalibleColor));

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
            endTime: endTime,
            startColor: this.avalibleColor
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
        let lastElement;
        let result = arrayHelper.forNextRight(room, (current, next, index, array) => {
            let currentStartTime = dateHelper.buildDateFromString(current.booking.time.startTime);
            let currentEndTime = dateHelper.buildDateFromString(current.booking.time.endTime);
            let nextStartTime = dateHelper.buildDateFromString(next.booking.time.startTime);
            let nextEndTime = dateHelper.buildDateFromString(next.booking.time.endTime);

            lastElement = this.buildSchedule(nextStartTime, next.booking.id, avalibleTimes, nextEndTime);
            if(this.isFullIntervall(currentStartTime, nextEndTime, maxTimeVal)){
                return this.buildSchedule(currentStartTime, current.booking.id, avalibleTimes, currentEndTime);
            }
            let timeBetweenDates = dateHelper.getTimeBetweenDates(currentStartTime, nextEndTime);
            let timeSchedule = this.addTimeToArray(avalibleTimes, timeBetweenDates);
            let newAvalibleTimes = this.getAllTimesAfter(timeBetweenDates, timeSchedule);
            return this.buildSchedule(currentStartTime, current.booking.id, newAvalibleTimes, currentEndTime);
        });
        result.push(lastElement);
        return result.reverse();
    }

    /**
     * [checks if maxTimeVal is bigger than the difference between a and b ]
     * @param  {[date]}  a    [date object]
     * @param  {[date]}  b    [date object]
     * @param  {[int]}  maxTimeVal [time in minutes]
     * @return {Boolean}         [returns if maxtimeVal i smaller than time dif]
     */
    isFullIntervall(a, b, maxTimeVal){
        return dateHelper.getTimeBetweenDates(a, b) >= maxTimeVal;
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
        var tempArray = arrayHelper.copyArray(avalibleTimes);
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
        var tempArray = arrayHelper.copyArray(avalibleTimes);
        tempArray[tempArray.length] = tempArray[tempArray.length-1];
        tempArray.reduce((prev, current, index, array) => {
            scheduleObject.push(
                this.timeObject(
                    dateHelper.subtractTime(startTime, prev.time),
                    prev.color,
                    current.color,
                    prev.fade,
                    prev.pulse,
                    prev.emit,
                    dateHelper.getTimeBetweenDates(
                        dateHelper.addMinuteToDate(prev.time),
                        dateHelper.addMinuteToDate(current.time)),
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
     * [it adds the default start color value]
     * @param  {[]} colorTimeSchedule []
     * @return {[array]}  [array with start color values added to colorTimeSchedule]
     */
    getStartColor(colorTimeSchedule){
        let singleBookings = colorTimeSchedule.filter(room => !arrayHelper.isArrayLargerThanOne(room));
        let multibleBookings = colorTimeSchedule.filter(room => arrayHelper.isArrayLargerThanOne(room))
            .map(rooms => rooms.map(room => this._addStartColor(room)));

        singleBookings = arrayHelper.concatArray(singleBookings)
            .map(room => this._addStartColor(room));

        return arrayHelper.mergeArrays(
                multibleBookings, singleBookings);
    }

    _addStartColor(room){
        const timeNow = new Date();
        let startColorObj = null;
        let itemIndex = null;
        room.colorSchedule.reduce((prev, current, index, array) => {
            if(timeNow > prev.time && timeNow < current.time){
                let aColor = this.colorTimeConverter.getColor(
                        prev.time, current.time, timeNow, prev.color, current.color);
                itemIndex = index;
                let color = prev.color;
                room.startColor = prev.color;
                if(prev.fade){
                    color = Math.floor(aColor);
                    room.startColor = Math.floor(aColor);
                }
                startColorObj = this.timeObject(
                    dateHelper.addMinuteToDate(1, timeNow),
                    color, current.color, prev.fade, prev.pulse, prev.emit,
                    Math.floor(dateHelper.getTimeBetweenDates(current.time, timeNow)),
                    Math.floor(dateHelper.getTimeBetweenDates(
                        room.startTime, timeNow))
                );
                if(dateHelper.getTimeBetweenDates(dateHelper.addMinuteToDate(1, timeNow),current.time) === 0){
                    startColorObj = null;
                }
            }
            return current;
        });
        if(startColorObj !== null){
            room.colorSchedule.splice(itemIndex, 0, startColorObj);
        }
        startColorObj = null;
        itemIndex = null;
        if(timeNow > room.startTime && timeNow < room.endTime){
            room.startColor = this.roomOccupiedColor;
        }
        return room;
    }

    /**
     * [creates endTime ColorSchedule for bookings]
     * @return {[array]}               [colorSchedule with end times]
     */
    endTimeBuilder(roomsColorSchdule, maxTimeVal, avalibleColor){
        let lastElement;
        let bookingEnd = 'bookingEnd';
        let singleBookings = roomsColorSchdule.filter(room => !arrayHelper.isArrayLargerThanOne(room));
        let multibleBookings = roomsColorSchdule.filter(room => arrayHelper.isArrayLargerThanOne(room));

        let singleLastElements = arrayHelper.concatArray(singleBookings).map((room) => {
            room.colorSchedule.push(this.timeObject(
                room.endTime, avalibleColor, avalibleColor,
                false, false, true, null,
                bookingEnd ));
            return room;
        });

        multibleBookings.forEach((room) => {
            arrayHelper.forNext(room, (current, next, index, array) => {
                let currentEndTime = current.endTime;
                let nextStartTime = next.startTime;
                let nextEndTime = next.endTime;
                lastElement = this.timeObject(
                    nextEndTime, avalibleColor, avalibleColor,
                    false, false, true, null,
                    bookingEnd );

                if(this.isFullIntervall(nextStartTime, currentEndTime, maxTimeVal)){
                    current.colorSchedule.push(this.timeObject(
                        currentEndTime, avalibleColor, avalibleColor,
                        false, false, true, null,
                        bookingEnd ));
                }
            });
            room[room.length-1].colorSchedule.push(lastElement);
        });
        return arrayHelper.mergeArrays(
            arrayHelper.concatArray(multibleBookings), singleLastElements);
    }
};

module.exports = new ColorSchedule();
