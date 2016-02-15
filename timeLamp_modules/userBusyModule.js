var timeEditDAL = require('../timeeditDAL/timeeditDAL.js')

function userBusyModule(){
	this.timeEditApiLnu = new timeEditDAL(		
                'https://se.timeedit.net/web/lnu/db1/schema1/',
                3
            );
	
	console.log(this.timeEditApiLnu);
}

exports.run = userBusyModule();