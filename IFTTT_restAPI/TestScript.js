var http = require('http');

//var request = require('request');

var testRun = function(){
	
	
	
	console.log("testobj initated.");

	
	var testObj = {
		id: "1234",
		presence: true
	}
	
	console.log("options initated.");
	
	var options = {
		host: "localhost",
		path: "/",
		method: 'POST',
		port: '3000',
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded'
				
		}
	};
	
	
	
	var req = http.request(options, function(res){
		console.log("Request sent.")
	})
	
	req.write(JSON.stringify(testObj));
	req.end();
	
	
	/*request({
		url: 'http://localhost:3000/',
		method: 'POST',
		json: true,
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(testObj)
	}, function(error, res, body){
		//console.log(body);
		console.log("Test complete.");
	})*/
	
	
}

testRun();