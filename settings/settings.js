"use strict";

// Här sköts inställningarna på lamporna. Vi kommer ha inställningar för både Blink(1) mk 2
// och för Philips hue lampan. Vi har en JSON fil som kommer innehålla information om TYP, ID, mm.

//en fil (settings.json)
// DETTA ÄR TYP EN DAL KLASS för settings. Från denna klass ska man kunna hämta alla objekt beroende
// på typ, id, mm.

const Settings = class {

    var fsp = require('fs-promise');
    var name;
    var id;

    //JSONParser parser = new JSONParser();
    //Object settingsJSON = parser.parse("settings.json");
    //JSONObject jsonObject = (JSONObject) settingsJSON;

    constructor() {
    }

    getName(){
        fsp.readFile("settings.json", {encoding;'utf8'}).then(function(data){
            //name = (String) jsonObject.get("Name");
            if("" = "hue")
            {
                name = "hue";
            }
            name = "blink";
        }).catch(function(error){
            console.log("error the Getname dont work.")
        }
    }

    getID(){
        fsp.readFile("settings.json", {encoding;'utf8'}).then(function(data){
            if("" = id)
            {
                console.log("hej");
            }
        };
    }
}
