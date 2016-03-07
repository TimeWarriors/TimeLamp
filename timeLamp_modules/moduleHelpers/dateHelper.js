'use strict';

const DateHelper = class ClassName {
    constructor() {

    }

    /**
     * [makes new date]
     * @param  {[string]} time    [hour and minute in string ex '10:55']
     * @param  {[int]} timeDif [time diff in minutes]
     * @return {[date]}         [new date object]
     */
    buildDateFromString(timeString, timeDif){
        let hourMinute = this._splitTime(timeString);
        let today = new Date();
        let myDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            hourMinute[0],
            hourMinute[1]
        );
        return timeDif ?
            this.subtractTime(myDate, timeDif) :
            myDate;
    }

    /**
     * [add minutes to new date]
     * @param {[int]} addMinute [minutes]
     * @param {[date]} d [date]
     * @return {[date]}          [new date]
     */
    addMinuteToDate(addMinute, d){
        d = d || new Date();

        let myDate = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes()
        );

        myDate.setMinutes(myDate.getMinutes()+addMinute);
        return myDate;
    }

    addDayToDate(days, d){
        d = d || new Date();
        d.setDate(d.getDate()+days);
        return d;
    }

    subtractTime(date, time){
        let myDate = new Date(date);
        myDate.setMinutes(myDate.getMinutes()-time);
        return myDate;
    }

    /**
     * [returns the time between two dates]
     * @param  {[date]} a    [date object]
     * @param  {[date]} a [date object]
     * @return {[int]}         [time between dates in minutes]
     */
    getTimeBetweenDates(a, b){
        return (a.getTime() - b.getTime())/1000/60;
    }

    _splitTime(timeString){
        return timeString.split(':');
    }

};

module.exports = new DateHelper();
