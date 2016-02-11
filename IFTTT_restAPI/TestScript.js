var http = require('http');

//var request = require('request');

var testRun = function(){
	
	console.log("options initated.");
	
	var options = {
		host: "localhost",
		path: "/update/1234/true",
		method: 'POST',
		port: '3000'
		
	};
	
	var req = http.request(options, function(res){
		console.log(res.statusCode);
	})
	
	req.end();		
}

testRun();