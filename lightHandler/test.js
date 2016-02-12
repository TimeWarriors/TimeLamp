'use strict'
let LightHandler = require('./lightHandler.js');
let lightHandler = new LightHandler();

////ändra till grön

lightHandler.changeColorWithHue("4", 0, 1);
lightHandler.changeColorWithHue("3", 0, 1);

//lightHandler.changeColorWithHue("4", 46920, 1);
//lightHandler.changeColorWithHue("3", 56228, 1);

//lightHandler.changeColorWithHue("4", 65535, 60);
//setTimeout(function(){lightHandler.changeColorWithHue("3", 65535, 30)}, 30000)

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
