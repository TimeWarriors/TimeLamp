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

//lightHandler.changeColorWithHue("4", 0, 10);
//setTimeout(function(){lightHandler.changeColorWithHue("3", 0, 3)}, 7000)

let lampToTest = "4";

testOn()
    .then(function(res){
    console.log(res);
    testchangeBrigthnessAndChangeColorWithHue()
    .then(function(res){
    console.log(res);
    })
});

//Test 1 changeColorWithHue and changeBrightness
function testchangeBrigthnessAndChangeColorWithHue(){
    return new Promise((resolve, reject) => {
        console.log("╔═══════════════════════════════════════╗");
        console.log("║ changeColorWithHue & changeBrightness ║")
        console.log("╚═══════════════════════════════════════╝");
        let firstColor = 0;//0-65535
        let secondColor = 25500;//0-65535
        let firstBrightness = 0;//0-254
        let secondBrightness= 254;//0-254
        //change color and brightness
        lightHandler.changeColorWithHue(lampToTest, firstColor, 0);
        lightHandler.changeBrightness(lampToTest, firstBrightness, 0);
        lightHandler.getHueLamps().then(function(res){
            //FIRST RESULT
            var object = JSON.parse(res);
            console.log("changeColorWithHue test 1) expected result: " + firstColor + " actual result: " + object[lampToTest].state.hue)
            console.log("changeBrightness test 1) expected result: " + firstBrightness + " actual result: " + object[lampToTest].state.bri)
            //see if the color and brighness is what you wanted to change it to
            if(firstColor === object[lampToTest].state.hue && firstBrightness === object[lampToTest].state.bri)
            {
                //change color and brightness
                lightHandler.changeColorWithHue(lampToTest, secondColor, 0);
                lightHandler.changeBrightness(lampToTest, secondBrightness, 0);
                lightHandler.getHueLamps().then(function(res){
                    var object = JSON.parse(res);
                    //SECOND RESULT
                    console.log("changeColorWithHue test 2) expected result: " + secondColor + " actual result: " + object[lampToTest].state.hue);
                    console.log("changeBrightness test 2) expected result: " + secondBrightness + " actual result: " + object[lampToTest].state.bri)

                    //FINAL RESULT
                    if(secondColor === object[lampToTest].state.hue)//see if color was changed correctly
                    {
                        if(secondBrightness === object[lampToTest].state.bri)//see if brightness was changed correctly.
                        {
                            return resolve("changeBrightness & changeColorWithHue: the functions correctly changes brightness and color. Success!");
                        }
                        else
                        {
                            return resolve("changeBrightness: the function incorrectly changes brightness. Fail!")
                        }
                    }
                    else
                    {
                        return resolve("changeColorWithHue: the function incorrectly changes color. Fail!")
                    }
                })
            }
            else
            {
                if(firstColor !== object[lampToTest].state.hue)
                {
                    return resolve("changeColorWithHue: the function incorrectly changes color. Fail!")
                }
                if(firstBrightness === object[lampToTest].state.bri)
                {
                    return resolve("changeBrightness: the function incorrectly changes brightness. Fail!")
                }
            }
        });
    })

}
//Test 2 On
function testOn(){
  return new Promise((resolve, reject) => {
    console.log("╔═══════════════════════════════════════╗");
    console.log("║                  On                   ║");
    console.log("╚═══════════════════════════════════════╝");
    let firstStatus = false;
    let secondStatus = true;
    lightHandler.On(lampToTest, firstStatus);
    lightHandler.getHueLamps().then(function(res){
        let object = JSON.parse(res);
        console.log("on test 1) expected result: " + firstStatus + " actual result: " + object[lampToTest].state.on)
        if(object[lampToTest].state.on === firstStatus)
        {
            lightHandler.On(lampToTest, secondStatus);
            lightHandler.getHueLamps().then(function(res){
                let object = JSON.parse(res);
                console.log("on test 2) expected result: " + secondStatus + " actual result: " + object[lampToTest].state.on)
                if(object[lampToTest].state.on === secondStatus)
                {          
                    return resolve("On: turns the lamp on and off correctly. Success")
                }
                else
                {
                    return resolve("On: does not turn on the lamp correctly. FAIL!")
                }
            })
        }                                    
        else
        {
            return resolve("On: does not turn off the lamp correctly. FAIL!")
        }       
    })  
  })
}


