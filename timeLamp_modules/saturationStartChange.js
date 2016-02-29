'use strict';
const co = require('co');
const SaturationStartChange = class {
    constructor(functionLayer) {
        this._ = functionLayer;
    }

    init(){
        co(function*(){
            let lamps = yield this.getLamps('hue');
            return this.getHueLampId(lamps);
        }.bind(this))
            .then((lampIds) => {
                this.changeSaturation(lampIds);
            }).catch((er) => {
                console.error(er);
            });

    }

    changeSaturation(lampIds){
        lampIds.forEach((id) => {
            this._.lightHandler.changeSaturation(id, 255, 0);
        });
    }

    getHueLampId(lamps){
        return lamps.map(lamp => lamp.lampId);
    }

    getLamps(lampType){
        return Promise.resolve(this._.settings.getLamps(lampType));
    }
};

exports.run = function(functionLayer){
    return new SaturationStartChange(functionLayer);
};
