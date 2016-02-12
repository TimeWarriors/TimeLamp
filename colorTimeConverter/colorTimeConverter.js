"use strict";
//hårdkodande för testa
let colorAt120 = 25500; //grön
let colorAt60 = 20678; //gul
let colorAt30 = 6375; //orange
let colorAt0 = 0; //röd

function ColorTimeConverter(){
    
}
//f1=startfärg, f2 = slutfärg, t1 = starttid, t2 = sluttid, tn = tid nu.
//f1-((f1-f2)/(t1-t2))*(t1-tn)
ColorTimeConverter.prototype.getColor = function(startTime, endTime, currentTime, startColor, endColor){
    let hueColor = startColor - (startColor - endColor)/(startTime - endTime)*(startTime - currentTime);
    return hueColor;
}
module.exports = ColorTimeConverter;