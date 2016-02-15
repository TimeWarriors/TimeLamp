'use strict'
let LightHandler = require('./lightHandler.js');
let lightHandler = new LightHandler();


////grön
//lightHandler.changeColorWithHue("4", 25500, 1);
////röd
//lightHandler.changeColorWithHue("3", 0, 1);
////gul
//lightHandler.changeColorWithHue("4", 20678, 1);
////orange
//lightHandler.changeColorWithHue("3", 6375, 1);

//lightHandler.changeColorWithHue("4", 20678, 0);
//lightHandler.changeColorWithHue("3", 6203, 0);
//
lightHandler.changeColorWithHue("4", 0, 10);
setTimeout(function(){lightHandler.changeColorWithHue("3", 0, 3)}, 7000)

//lightHandler.changeColor("4", 0, 255, 0, 0);
//lightHandler.changeColor("3", 255, 255, 0, 0);

//lightHandler.setWarning("4", 1000, 10);
//lightHandler.setWarning("3", 200, 5);

//lightHandler.changeColor("4", 255, 0, 0, 60);
//setTimeout(function(){lightHandler.changeColor("3", 255, 0, 0, 30)}, 30000)

//lightHandler.On("4", true);
//lightHandler.On("4", false);

//lightHandler.changeBrightness("3", 255, 1);
//lightHandler.changeBrightness("4", 255, 1);
