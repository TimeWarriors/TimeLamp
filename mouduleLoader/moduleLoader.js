'use strict';
const fsp = require('fs-promise');
const ModuleLoader = class {
    constructor(functionLayer) {
        this._ = functionLayer;
        this.timeLampModules = [];
        this.requireModules();
    }

    requireModules(){
        this.timeLampModules.push(
            require('../timeLamp_modules/changeColorWithTime.js').run(this._)
        );
    }

    /**
     * [starts timeLamp modules]
     * @return {[object]} [all the modules]
     */
    runModules(functionLayer){
        this.timeLampModules.forEach((timeLampModule) => {
            try {
                timeLampModule.init();
            } catch (e) {
                fsp.writeFile(`${__dirname}/debuglog.txt`, e);
            }
        });
    }

};

module.exports = ModuleLoader;
