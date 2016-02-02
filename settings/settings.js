"use strict";

// Här sköts inställningarna på lamporna. Vi kommer ha inställningar för både Blink(1) mk 2
// och för Philips hue lampan. Vi har en JSON fil som kommer innehålla information om TYP, lampId och romId.

// settings.json - I JSON filen finns alla lampor som existerar.

let fs = require('fs-promise');
let fileName = "settings.json";
let name = "";
let id = "";


const Settings = class {
    constructor() {
    }

    // En funktion som gör en parse på settings.json så att alla andra funktioner kan använda sig
    // utav den parsade variablen.
    // Även error om något går fel.
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

    // En funktion som hämtar ut alla lampor som finns av den typen.
    // Om man skickar in typen hue får man ut alla Philips hue lampor
    // Samma gäller för blink lamporna.
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
            })
        });
    }

    // En funktion som hämtar ut alla lampor som finns på rumId som man skickar in.
    // Om man skickar in rummet 105 så får man ut alla lampObjekt som finns på det här rummet.
    // Om idt inte finns eller är tomt, så skickars felmedelandet ut.
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
            })
        });
    }

    // En funktion som hämtar ut alla lampor som finns på lampId som man skickar in.
    // En lampa borde ha ett unikt id då man oftast vill att lamporna ska ha olika
    // funktionalitet och bokningar.
    // Om lampans Id inte finns kommer felmedelandet skrivas ut.
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
            })
        });
    }
}

module.exports = new Settings();

    // Test kod som testar de olika funtionerna med hårdkodade värden.
    // Även alla id som är i settings.json är hårdkodade.

    // let setting = new Settings();
    //
    // setting.getLamps("hue").then((types) =>{
    //     console.log(JSON.stringify(types, null, 2));
    // }).catch((error) =>{
    //     console.log(error);
    // });
    //
    // setting.getLampsinRoom("105").then((rooms) =>{
    //     console.log(JSON.stringify(rooms, null, 2));
    // }).catch((error) =>{
    //     console.log(error);
    // })
    //
    // setting.getIdOnLamps("XXX").then((lamps) =>{
    //     console.log(JSON.stringify(lamps, null, 2));
    // }).catch((error) =>{
    //     console.log(error);
    // })
