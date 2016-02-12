'use strict';
const TimeeditApi = require('timeeditapi');
const FileCacheSimple = require('file-cache-simple');

const TimeeditDAL = class extends TimeeditApi {
    constructor(url1, type) {
        super(url1, type);
        this.cache = new FileCacheSimple();
    }

    /**
     * [checks if stored data is valid, if not get frech data store it and return in]
     * @return {[object]}        [room schedule]
     */
    getTodaysSchedule(id){
        return new Promise((resolve, reject) => {
            let key  = id + 'today';
            this.cache.get(key)
            .then((value) => {
                if(!value || value === null) {
                    this._getTodaysSchedule(id)
                        .then((schedule) => {
                            this.cache.set(key, schedule, 10800 * 1000); // 3tim
                            return resolve(schedule);
                        }).catch((er) => {
                            reject(er);
                        });
                }else{
                    return resolve(value);
                }
            }).catch((er) => {
                reject(er);
            });
        });
    }

    /**
     * [checks if stored data is valid, if not get frech data store it and return in]
     * @return {[object]}        [room schedule]
     */
    getSchedule(id){
        return new Promise((resolve, reject) => {
            let key = id + 'full';
            this.cache.get(key)
            .then((value) => {
                if(!value || value === null) {
                    this._getSchedule(id)
                        .then((schedule) => {
                            this.cache.set(key, schedule, 10800 * 1000); // 3tim
                            return resolve(schedule);
                        }).catch((er) => {
                            reject(er);
                        });
                }else{
                    return resolve(value);
                }
            }).catch((er) => {
                reject(er);
            });
        });
    }

    _getSchedule(id){
        return super.getRoomSchedule(id);
    }

    _getTodaysSchedule(id){
        return super.getTodaysSchedule(id);
    }

};

module.exports = TimeeditDAL;
