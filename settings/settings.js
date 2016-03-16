"use strict";
//This is the where the main settings of the lamps is controlled.
//There is a JSON file wich will contain the type of the lamp, the lampId and also the roomId.
//The JSON file containing the data is called lampSettings.json.
let fs = require('fs-promise');
let fileName = __dirname+"/settings.json";
const Settings = class {
    constructor() {
    }
    //This function creates a parse of the lampSettings.json.
    //It also saves the parsed content into a variable called fileParsed.
    //Function will cast an error if one occur.
    /**
     * [parsedFile description]
     * @return {[Promise]} [resolves a parsed content of a JSON file]
     */
    parsedFile(){
        return new Promise(function(resolve, reject) {
            fs.readFile(fileName, 'utf8').then((res) =>{
                let fileParsed = JSON.parse(res);
                resolve(fileParsed);
            }).catch((error) =>{
                reject(error);
            });
        })
    }
    //This function GET's all the lamps of a specific type.
    //Function will cast an error if one occur.
    /**
     * [getLamps description]
     * @param  {[string]} type [string from lampSettings.json]
     * @return {[Promise]}     [resolves a list with objects cointaining the type]
     */
    getLamps(type){
        return new Promise((resolve, reject) => {
            this.parsedFile().then((file) => {
                let filterdType = file.filter((lamp)  =>{
                    return lamp.type === type;
                });
                if(filterdType.length === 0){
                    reject("Type was not fund.");
                }
                resolve(filterdType);
            }).catch((error) =>{
                reject(error);
            })
        });
    }
    //This function GET's all lamps wich exists in a room.
    //This is decided by the roomId.
    //If the id dose not exist or the id is empthy the function will cast an error.
    /**
     * [getLampsinRoom description]
     * @param  {[string]} roomId [string from lampSettings.json]
     * @return {[Promise]}       [resolves a list with objects cointaining the roomId]
     */
    getLampsinRoom(roomId){
        return new Promise((resolve, reject) => {
            this.parsedFile().then((file) => {
                let filterdRoom = file.filter((room) =>{
                    return room.roomId === roomId;
                });
                 if(filterdRoom.length === 0){
                     reject("The room was not found");
                 }
                resolve(filterdRoom);
            }).catch((error) =>{
                reject(error);
            })
        });
    }
    //This function GET's all the lamps wich exist on a lampId.
    //This is decided by the lampId.
    //If the lampId do not exist the function will cast an error.
    /**
     * [getIdOnLamps description]
     * @param  {[string]} lampId [string from lampSettings.json]
     * @return {[Promise]}       [resolves a list with objects cointaining the lampId]
     */
    getIdOnLamps(lampId){
        return new Promise((resolve, reject) => {
            this.parsedFile().then((file) => {
                let filterdLamp = file.filter((lamp) =>{
                    return lamp.lampId === lampId;
                });
                 if(filterdLamp.length === 0){
                     reject("The lamp was not found");
                 }
                resolve(filterdLamp);
            }).catch((error) =>{
                reject(error);
            })
        });
    }
}
module.exports = new Settings();
