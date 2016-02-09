'use strict'
let LightHandler = require('./lightHandler.js');
let lightHandler = new LightHandler();

////ändra till grön
//lightHandler.changeColor("4", 255, 0, 0, 0);
//lightHandler.changeColor("3", 255, 0, 0, 0);

//lightHandler.setWarning("4", 500, 5);
//lightHandler.setWarning("3", 500, 5);

//lightHandler.changeColor("4", 0, 0, 255, 10);
//lightHandler.changeColor("4", 0, 0, 255, 10);

lightHandler.On("4", true);
//lightHandler.On("4", false);
