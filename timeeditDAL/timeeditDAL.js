'use strict';
const TimeeditApi = require('timeeditapi');
const FileCacheSimple = require('file-cache-simple');

const TimeeditDAL = class extends TimeeditApi {
    constructor(url1, url2) {
        super(url1, url2);
        this.cache = new FileCacheSimple();
    }

    /**
     * [checks if stored data is valid, if not get frech data store it and return in]
     * @return {[object]}        [room schedule]
     */
    getTodaysRoomSchedule(roomId){
        return new Promise((resolve, reject) => {
            let key  = roomId + 'today';
            this.cache.get(key)
            .then((value) => {
                if(!value || value === null) {
                    this._getTodaysRoomSchedule(roomId).then((roomSchedule) => {
                        this.cache.set(key, roomSchedule, 10800 * 1000); // 3tim
                        resolve(roomSchedule);
                    });
                }else{
                    resolve(value);
                }
            });
        });
    }

    /**
     * [checks if stored data is valid, if not get frech data store it and return in]
     * @return {[object]}        [room schedule]
     */
    getRoomSchedule(roomId){
        return new Promise((resolve, reject) => {
            let key = roomId + 'full';
            console.log(key);
            this.cache.get(key)
            .then((value) => {
                if(!value || value === null) {
                    this._getRoomSchedule(roomId).then((roomSchedule) => {
                        this.cache.set(key, roomSchedule, 10800 * 1000); // 3tim
                        resolve(roomSchedule);
                    });
                }else{
                    resolve(value);
                }
            });
        });
    }

    _getRoomSchedule(roomId){
        return super.getRoomSchedule(roomId);
    }

    _getTodaysRoomSchedule(roomId){
        return super.getTodaysRoomSchedule(roomId);
    }

};

module.exports = TimeeditDAL;
