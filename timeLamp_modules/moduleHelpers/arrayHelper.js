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

    mergeArrays(a, b){
        return a.concat(b);
    }

    /**
     * [removes null values from array's]
     */
    filterNull(arr){
        return arr.filter(i => i !== null);
    }

    forNext(a, callback){
        let result = [];
        for(let i = 0; i < a.length; i++){
            if(i+1 < a.length){
                result.push(this._callbackH(callback, a[i], a[i+1], i, a));
            }
        }
        return result;
    }

    forNextRight(a, callback){
        let result = [];
        for(let i = a.length; i > 0; i--){
            if(i < a.length){
                result.push(this._callbackH(callback, a[i], a[i-1], i, a));
            }
        }
        return result;
    }

    _callbackH(callback, current, next, index, array){
        return callback(current, next, index, array);
    }

};


module.exports = new ArrayHelper();
