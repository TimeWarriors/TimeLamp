'use strict'
let LightHandler = require('./lightHandler.js');
let lightHandler = new LightHandler();
let assert = require('assert');


let testLamp = "3";
describe('lightHandler.getHueLamps()', function () {
    var tests = [
        {
            expected: {},
        },
  ];

    tests.forEach(function (test) {
        it("gets the lamps", function () {
            return lightHandler.getHueLamps.apply(null).then(function (res) {
                try {
                    let obj = JSON.parse(res);
                    assert(typeof (obj) === typeof (test.expected), "Expected: " + typeof (test.expected) + " got: " + typeof (obj));
                } catch (e) {
                    assert(false, "not valid json object. Got error: " + e.message)
                }
            })
        });
    })
});

describe('lightHandler.getHueLampById()', function () {
    var tests = [
        {
            args: [testLamp], 
            expected: {}
        },
  ];

    tests.forEach(function (test) {
        it("gets the lamp", function () {
            return lightHandler.getHueLampById.apply(null, test.args).then(function (res) {
                try {
                    let obj = JSON.parse(res);
                    assert(typeof (obj) === typeof (test.expected), "Expected: " + typeof (test.expected) + " got: " + typeof (obj));
                } catch (e) {
                    assert(false, "not valid json object. Got error: " + e.message)
                }
            })
        });
    })
});

describe('lightHandler.changeColorWithHue()', function () {
    var testLampId = testLamp;
    var tests = [
        {
            args: [testLampId, 20678, 0],
            expected: true
        },
        {
            args: [testLampId, 30000, 0],
            expected: true
        },
        {
            args: [testLampId, 0, 0],
            expected: true
        },
        {
            args: [testLampId, 193813209813, 0],
            expected: false
        },
    ];

    tests.forEach(function (test) {
        it("Change hue to " + test.args[1], function (done) {
            lightHandler.changeColorWithHue.apply(null, test.args).then((res) => {
                try {

                    let object = JSON.parse(res);
                    let result;
                    if (!object) {
                        assert(false, "function does not return a valid JSON object");
                    } else
                        for (let i = 0; i < object.length; i++) {
                            if (object[i].error) {
                                result = false;
                                assert.equal(result, test.expected, "Failed to change hue to parameter: " + test.args[1])
                                break;
                            } else if (object[i].success) {
                                result = true;
                                assert.equal(result, test.expected, "Successfully changed hue to invalid parameter: " + test.args[1])
                            } else {
                                assert(false, "something unexpected went wrong in the function")
                                break;
                            }
                        }
                    done();
                } catch (e) {
                    return done(e);
                }
            });
        });
    })
});

describe('lightHandler.changeBrightness()', function () {
    var testLampId = testLamp;
    var tests = [
        {
            args: [testLampId, 125, 0],
            expected: true
        },
        {
            args: [testLampId, 0, 0],
            expected: true
        },
        {
            args: [testLampId, 254, 0],
            expected: true
        },
        {
            args: [testLampId, 2000, 0],
            expected: false
        },
    ];

    tests.forEach(function (test) {
        it("Change brightness to " + test.args[1], function (done) {
            lightHandler.changeBrightness.apply(null, test.args).then((res) => {
                try {

                    let object = JSON.parse(res);
                    let result;
                    if (!object) {
                        assert(false, "function does not return a valid JSON object");
                    } else
                        for (let i = 0; i < object.length; i++) {
                            if (object[i].error) {
                                result = false;
                                assert.equal(result, test.expected, "Failed to change bri to parameter: " + test.args[1])
                                break;
                            } else if (object[i].success) {
                                result = true;
                                assert.equal(result, test.expected, "Successfully changed bri to invalid parameter: " + test.args[1])
                            } else {
                                assert(false, "something unexpected went wrong in the function")
                                break;
                            }
                        }
                    done();
                } catch (e) {
                    return done(e);
                }
            });
        });
    })
});

describe('lightHandler.changeSaturation()', function () {
    var testLampId = testLamp;
    var tests = [
        {
            args: [testLampId, 2500, 0],
            expected: false
        },
        {
            args: [testLampId, 0, 0],
            expected: true
        },
        {
            args: [testLampId, 125, 0],
            expected: true
        },
        {
            args: [testLampId, 254, 0],
            expected: true
        },
    ];
    tests.forEach(function (test) {
        it("Change saturation to " + test.args[1], function (done) {
            lightHandler.changeSaturation.apply(null, test.args).then((res) => {
                try {

                    let object = JSON.parse(res);
                    let result;
                    if (!object) {
                        assert(false, "function does not return a valid JSON object");
                    } else
                        for (let i = 0; i < object.length; i++) {
                            if (object[i].error) {
                                result = false;
                                assert.equal(result, test.expected, "Failed to change sat to parameter: " + test.args[1])
                                break;
                            } else if (object[i].success) {
                                result = true;
                                assert.equal(result, test.expected, "Successfully changed sat to invalid parameter: " + test.args[1])
                            } else {
                                assert(false, "something unexpected went wrong in the function")
                                break;
                            }
                        }
                    done();
                } catch (e) {
                    return done(e);
                }
            });

        });
    })
});

//////GAMMALT SOM KANSKE BEHÖVS OM DET FUCKAR I color testet senare
//    var testLampId = testLamp;
//    var tests = [
//      {args: [testLampId, 20678, 0], expected: 20678},
//      {args: [testLampId, 30000, 0], expected: 30000},
//      {args: [testLampId, 0, 0], expected: 0},
//    ];   
//
//    tests.forEach(function(test) {
//        it("Change color to "+test.expected, function(done) {
//            lightHandler.changeColorWithHue.apply(null, test.args).then(
//            lightHandler.getHueLampById.call(null, testLampId).then(function(res){
//                let hueColor = JSON.parse(res).state.hue;
//                try{
//                    if(hueColor == test.expected)
//                    {
//                        assert(true, "Expected: "+test.expected+" got: "+hueColor);
//                    }
//                    else
//                    {
//                        assert(false, "Expected: "+test.expected+" got: "+hueColor);
//                    }
//                    done();                    
//                }
//                catch(e){
//                    return done(e);
//                }
//
//            }))   
//        });  
//    })