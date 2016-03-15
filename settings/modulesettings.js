"use strict";
//This is the where the color settings and also the values of the lamps is controlled.
//There is a JSON file wich will contain all the colors and values.
//The JSON file containing the data is called moduleSettings.json.
let fs = require('fs-promise');
let fileName = __dirname+"/modulesettings.json";
const ModuleSettings = class {
    constructor() {
    }
    //This function creates a parse of the lampSettings.json.
    //It also saves the parsed content into a variable called fileParsed.
    //Function will cast an error if one occur.
    /**
     * [parsedFile description]
     * @return {[Promise]} [resolve a parsed content of a JSON file]
     */
    parsedFile(){
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, 'utf8').then((res) =>{
                let fileParsed = JSON.parse(res);
                resolve(fileParsed);
            }).catch((error) =>{
                reject(error);
            });
        })
    }
    //This function returns all the settings in the moduleSettings.json file.
    /**
     * [getModuleSettings description]
     * @return {[Promise]} [resolves an object containing objects]
     */
    getModuleSettings(){
        return new Promise((resolve, reject) => {
             this.parsedFile().then((lampInfo) =>{
                resolve(lampInfo);
            }).catch((error) =>{
                reject(error);
            });
        });
    }
}
module.exports = new ModuleSettings();
