'use strict';
const fsp = require('fs-promise');

const ModuleLoader = class {
    constructor() {}

    /**
     * [starts timeLamp modules]
     * @return {[object]} [all the modules]
     */
    startModules(functionLayer){
        return new Promise((resolve, reject) => {
            this._getFileNamesFromDir()
                .then((filenames) => {
                    return this._requireModules(filenames);
                })
                .then((modules) => {
                    this._runModules(modules, functionLayer);
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
        console.log(files);
        return files.map(filename => require(`../timeLamp_modules/${filename}`));
    }

    _runModules(modules, functionLayer){
        try {
            modules.forEach(m => m.init(functionLayer));
        } catch (e) {
            throw e;
        }

    }
};

module.exports = new ModuleLoader();
