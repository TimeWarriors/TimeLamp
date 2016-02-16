var fsp = require("fs-promise");
var nodeSchedule = require('node-schedule');
var timeEditApi = require('timeeditapi');
var timeEdit = new timeEditApi('https://se.timeedit.net/web/lnu/db1/schema1/', 3);

function scheduleHandler(){
	this.InitiateTimer();
	
}

scheduleHandler.prototype.InitiateTimer = function(){
	var rule = new nodeSchedule.RecurrenceRule();
	//rule.hour = 5;
	rule.second = 30;
	
	nodeSchedule.scheduleJob(rule, this.testRun);
	
	this.testRun();
}

scheduleHandler.prototype.getTodaysSchedule = function(){
	timeEdit.getTodaysSchedule('Johan Leitet').then((schedule) =>{
		console.log(JSON.stringify(schedule, null, 2));
		console.log(schedule[0].booking.time.startTime)
	}).catch((err)=>{
		console.log("ERROR: "+ err);
	})
}

scheduleHandler.prototype.testRun = function(){
	timeEdit.search('John_Häggerud')
    .then((result) => {
        console.log(JSON.stringify(result, null ,2));
    }).catch((er) => {
        console.log(er);
    });
}

module.exports = scheduleHandler;