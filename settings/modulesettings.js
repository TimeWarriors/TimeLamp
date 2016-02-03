"use strict";

let fs = require('fs-promise');
let fileName = __dirname+"/modulesettings.json";

const ModuleSettings = class {
    constructor() {
    }

    // En funktion som gör en parse på settings.json så att alla andra funktioner kan använda sig
    // utav den parsade variablen.
    // Även error om något går fel.
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

    // En funktion som retunerar alla settings i modulesettings.json.
    // modulesettings.json innehåller alla tre stadier för lampan.
    // Utaget, nästan uptaget och ledigt.
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

// let moduleSettings = new ModuleSettings();
//
// moduleSettings.getModuleSettings().then((lampInfo) =>{
//     console.log(JSON.stringify(lampInfo, null, 2));
// }).catch((error) =>{
//     console.log(error);
// });
