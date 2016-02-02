'use strict';
const fsp = require('fs-promise');

const ModuleLoader = class {
    constructor() {}

    /**
     * [starts timeLamp modules]
     * @return {[object]} [all the modules]
     */
    startModules(){
        return new Promise(function(resolve, reject) {
            this._getFileNamesFromDir()
                .then((filenames) => {
                    return this._requireModules(filenames);
                })
                .then((modules) => {
                    this._runModules(modules);
                    resolve(modules);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    _getFileNamesFromDir(){
        return fsp.readdir('../timeLamp_modules');
    }

    _requireModules(files){
        return files.map(filename => require('../timeLamp_modules'+filename));
    }

    _runModules(modules){
        try {
            modules.forEach(m => m.init());
        } catch (e) {
            throw e;
        }

    }
};

module.exports = new ModuleLoader();
