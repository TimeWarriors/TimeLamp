'use strict'
let LightHandler = require('./lightHandler.js');
let lightHandler = new LightHandler();
let assert = require('assert');

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


describe('lightHandler.getHueLamps()', function() {
  var tests = [
    {expected: {},},
  ];

  tests.forEach(function(test) {
    it("gets the lamps", function() {
        return lightHandler.getHueLamps.apply(null).then(function(res){
            try
            {
                let obj = JSON.parse(res);
                assert(typeof(obj) === typeof(test.expected), "Expected: "+typeof(test.expected)+" got: "+typeof(obj));
            }
            catch(e)
            {
                assert(false, "not valid json object. Got error: "+ e.message)   
            }
        })
    });    
  })      
});

describe('lightHandler.changeColorWithHue()', function() {
    var argnr = 0;
    var testLampId = "2";
    var tests = [
      {args: [testLampId, 20678, 0], expected: 20678},
      {args: [testLampId, 0, 0], expected: 0},
      {args: [testLampId, 30000, 0], expected: 30000},
    ];   
    beforeEach(function () {
        lightHandler.changeColorWithHue.apply(null, tests[argnr].args);
        argnr++;
    })

    tests.forEach(function(test) {
        it("Change color to "+test.expected, function(done) {
            lightHandler.getHueLampById.call(null, testLampId).then(function(res){
                let hueColor = JSON.parse(res).state.hue;
                try{
                    if(hueColor == test.expected)
                    {
                        assert(true, "Expected: "+test.expected+" got: "+hueColor);
                    }
                    else
                    {
                        assert(false, "Expected: "+test.expected+" got: "+hueColor);
                    }
                    done();                    
                }
                catch(e){
                    return done(e);
                }

            })   
        });  
    })      
});




//let lampToTest = "4";
//lightHandler.setWarning("2", 500, 5, 0)
//lightHandler.changeSaturation("2", 255, 0)
//
//testOn()
//.then(function(res){
//console.log(res);
//testchangeBrigthnessAndChangeColorWithHue()
//.then(function(res){
//console.log(res);
//testSaturation()
//.then(function(res){
//console.log(res);
//    
//})
//})
//});
//
////Test 1 changeColorWithHue and changeBrightness
//function testchangeBrigthnessAndChangeColorWithHue(){
//    return new Promise((resolve, reject) => {
//        console.log("╔═══════════════════════════════════════╗");
//        console.log("║ changeColorWithHue & changeBrightness ║")
//        console.log("╚═══════════════════════════════════════╝");
//        let firstColor = 0;//0-65535
//        let secondColor = 25500;//0-65535
//        let firstBrightness = 0;//0-254
//        let secondBrightness= 254;//0-254
//        //change color and brightness
//        lightHandler.changeColorWithHue(lampToTest, firstColor, 0);
//        lightHandler.changeBrightness(lampToTest, firstBrightness, 0);
//        setTimeout(function(){
//             lightHandler.getHueLamps().then(function(res){
//                //FIRST RESULT
//                var object = JSON.parse(res);
//                console.log("changeColorWithHue test 1) expected result: " + firstColor + " actual result: " + object[lampToTest].state.hue)
//                console.log("changeBrightness test 1) expected result: " + firstBrightness + " actual result: " + object[lampToTest].state.bri)
//                //see if the color and brighness is what you wanted to change it to
//                if(firstColor === object[lampToTest].state.hue && firstBrightness === object[lampToTest].state.bri)
//                {
//                    //change color and brightness
//                    lightHandler.changeColorWithHue(lampToTest, secondColor, 0);
//                    lightHandler.changeBrightness(lampToTest, secondBrightness, 0);
//                    setTimeout(function(){
//                        lightHandler.getHueLamps().then(function(res){
//                        var object = JSON.parse(res);
//                        //SECOND RESULT
//                        console.log("changeColorWithHue test 2) expected result: " + secondColor + " actual result: " + object[lampToTest].state.hue);
//                        console.log("changeBrightness test 2) expected result: " + secondBrightness + " actual result: " + object[lampToTest].state.bri)
//
//                        //FINAL RESULT
//                        if(secondColor === object[lampToTest].state.hue)//see if color was changed correctly
//                        {
//                            if(secondBrightness === object[lampToTest].state.bri)//see if brightness was changed correctly.
//                            {
//                                return resolve("changeBrightness & changeColorWithHue: the functions correctly changes brightness and color. Success!")
//                            }
//                            else
//                            {
//                                return resolve("changeBrightness: the function incorrectly changes brightness. Fail!")
//                            }
//                        }
//                        else
//                        {
//                            return resolve("changeColorWithHue: the function incorrectly changes color. Fail!")
//                        }
//                    })
//                    },200)
//                }
//                else
//                {
//                    if(firstColor !== object[lampToTest].state.hue)
//                    {
//                        return resolve("changeColorWithHue: the function incorrectly changes color. Fail!")
//                    }
//                    if(firstBrightness === object[lampToTest].state.bri)
//                    {
//                        return resolve("changeBrightness: the function incorrectly changes brightness. Fail!")
//                    }
//                }
//            });           
//        },200)
//
//    })
//
//}
////Test 2 On
//function testOn(){
//  return new Promise((resolve, reject) => {
//    console.log("╔═══════════════════════════════════════╗");
//    console.log("║                  On                   ║");
//    console.log("╚═══════════════════════════════════════╝");
//    let firstStatus = false;
//    let secondStatus = true;
//    lightHandler.On(lampToTest, firstStatus);
//    setTimeout(function(){
//        lightHandler.getHueLamps().then(function(res){
//            let object = JSON.parse(res);
//            console.log("on test 1) expected result: " + firstStatus + " actual result: " + object[lampToTest].state.on)
//            if(object[lampToTest].state.on === firstStatus)
//            {
//                setTimeout(function(){
//                    lightHandler.On(lampToTest, secondStatus);
//                    lightHandler.getHueLamps().then(function(res){
//                        let object = JSON.parse(res);
//                        console.log("on test 2) expected result: " + secondStatus + " actual result: " + object[lampToTest].state.on)
//                        if(object[lampToTest].state.on === secondStatus)
//                        {          
//                            return resolve("On: turns the lamp on and off correctly. Success")
//                        }
//                        else
//                        {
//                            return resolve("On: does not turn on the lamp correctly. FAIL!")
//                        }
//                    })
//                }, 200)
//            }                                    
//            else
//            {
//                return resolve("On: does not turn off the lamp correctly. FAIL!")
//            }   
//        }) 
//    }, 200)
//   
// 
//  })
//}
//
//function testSaturation(){
//    return new Promise((resolve, reject) => {
//        console.log("╔═══════════════════════════════════════╗");
//        console.log("║            changeSaturation           ║");
//        console.log("╚═══════════════════════════════════════╝");
//        let firstSat = 100;
//        let secondSat = 254;
//        lightHandler.changeSaturation(lampToTest, firstSat, 0);
//        setTimeout(function(){
//            lightHandler.getHueLamps().then(function(res){
//                let object = JSON.parse(res);
//                console.log("changeSaturation test 1) expected result: " + firstSat + " actual result: " + object[lampToTest].state.sat);
//                if(object[lampToTest].state.sat === firstSat)
//                { 
//                    setTimeout(function(){
//                        lightHandler.changeSaturation(lampToTest, secondSat, 0)
//                        lightHandler.getHueLamps().then(function(res){
//                            let object = JSON.parse(res);
//                            console.log("changeSaturation test 2) expected result: " + secondSat + " actual result: " + object[lampToTest].state.sat);
//                            if(object[lampToTest].state.sat === secondSat)
//                            {
//                                return resolve("changeSaturation: successfully changes the saturation. Success!");
//                            }
//                            else
//                            {
//                                 return resolve("changeSaturation: failed to change the saturation. FAIL!\nBecause of delays to the main hub this test may show the wrong result. Please try a couple of times to see if it's a consisten result or only happens once in a while");
//                            }
//                        })    
//                    }, 300)        
//                }
//                else
//                {
//                     return resolve("changeSaturation: failed to change the saturation. FAIL!");
//                }
//            });            
//        }, 200)
//
//    })
//}


