'use strict';

const ArrayHelper = class {
    constructor(){

    }

    /**
     * [check if array is larger than one]
     */
    isArrayLargerThanOne(arr){
        return arr.length >= 2;
    }

    copyArray(array){
        return array.slice(0);
    }

    concatArray(array){
        return [].concat.apply([], array);
    }

    /**
     * [removes null values from array's]
     */
    filterNull(arr){
        return arr.filter(i => i !== null);
    }
};

module.exports = new ArrayHelper();
