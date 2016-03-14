"use strict";

function ColorTimeConverter() {

}
//f1=startfärg, f2 = slutfärg, t1 = starttid, t2 = sluttid, tn = tid nu.
//f1-((f1-f2)/(t1-t2))*(t1-tn)
/**
 * Used to calculate what color should be used if the lamp has to restart in the middle of a transition time in seconds
 * @param   {int} startTime   [time transition was supposed to start]
 * @param   {int} endTime     [time transition should end]
 * @param   {int} currentTime [time passed]
 * @param   {int} startColor  [color it should've started the transition as(0-65535)]
 * @param   {int} endColor    [color it should end the transition as(0-65535)]
 * @returns {int} hueColor [color(0-65535)]
 */
ColorTimeConverter.prototype.getColor = function (startTime, endTime, currentTimePassed, startColor, endColor) {
    let hueColor = startColor - (startColor - endColor) / (startTime - endTime) * (startTime - currentTimePassed);
    return hueColor;
}
module.exports = ColorTimeConverter;