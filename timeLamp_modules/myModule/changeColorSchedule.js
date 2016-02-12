'use strict';

const ChangeColorSchedule = class  {
    constructor() {

    }


    getColorSchedule(roomSchedule){
        let p = roomSchedule.map((room) => {
            let q = [];
            room.reduceRight((prev, current, index, array) => {
                //console.log(current);
                //console.log(prev.booking.time);
                //console.log(prev.booking.time.endTime);
                q.push(this.buildDate(prev.booking.time.startTime, 120),
                this.buildDate(current.booking.time.startTime));
                return current;
            });

            return q;
        });

        console.log(p, null, 2);
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
        console.log(t);
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

module.exports = new ChangeColorSchedule();
