'use strict'
let ColorTimeConverter = require('./colorTimeConverter.js');
let colorTimeConverter = new ColorTimeConverter();

let startColor = 65535;
let endColor = 25500;
let expectedResult = startColor-(startColor-endColor)/3;
let result = colorTimeConverter.getColor(15, 0, 10, startColor, endColor);
if(result === expectedResult)
{
    console.log("Expected result was: "+expectedResult+" got: "+result+"\nTest Succeeded!");
}
else
{
    console.log("Expected result was: "+expectedResult+" got: "+result+"\Test FAILED!");
}