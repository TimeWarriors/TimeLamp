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

describe('lightHandler.changeBrightness()', function() {
    var argnr = 0;
    var testLampId = "2";
    var tests = [
      {args: [testLampId, 125, 0], expected: 125},
      {args: [testLampId, 0, 0], expected: 0},
      {args: [testLampId, 254, 0], expected: 254},
    ];   
    beforeEach(function () {
        lightHandler.changeBrightness.apply(null, tests[argnr].args);
        argnr++;
    })

    tests.forEach(function(test) {
        it("Change brightness to "+test.expected, function(done) {
            lightHandler.getHueLampById.call(null, testLampId).then(function(res){
                let hueBri = JSON.parse(res).state.bri;
                try{
                    if(hueBri == test.expected)
                    {
                        assert(true, "Expected: "+test.expected+" got: "+hueBri);
                    }
                    else
                    {
                        assert(false, "Expected: "+test.expected+" got: "+hueBri);
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

//describe('lightHandler.changeSaturation()', function() {
//    var argnr = 0;
//    var testLampId = "2";
//    var tests = [
//      {args: [testLampId, 125, 0], expected: 125},
//      {args: [testLampId, 0, 0], expected: 0},
//      {args: [testLampId, 254, 0], expected: 254},
//    ];   
//    beforeEach(function () {
//        lightHandler.changeSaturation.apply(null, tests[argnr].args);
//        argnr++;
//    })
//
//    tests.forEach(function(test) {
//        it("Change saturation to "+test.expected, function(done) {
//            lightHandler.getHueLampById.call(null, testLampId).then(function(res){
//                let hueSat = JSON.parse(res).state.sat;
//                try{
//                    if(hueSat == test.expected)
//                    {
//                        assert(true, "Expected: "+test.expected+" got: "+hueSat);
//                    }
//                    else
//                    {
//                        assert(false, "Expected: "+test.expected+" got: "+hueSat);
//                    }
//                    done();                    
//                }
//                catch(e){
//                    return done(e);
//                }
//
//            })   
//        });  
//    })      
//});



