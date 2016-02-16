var http = require('http');
var fsp = require('fs-promise');

var testID = "1234";
var testValue;


//test script for the app.post
var testRun = function(){
	
	console.log("options initated.");
	
	fsp.readFile("../settings/usersettings.json", {encoding:'utf8'}).then((contents) =>{
		var parsedContent = JSON.parse(contents);
		var data = null;
					
		for(var i = 0; i < parsedContent.length; i++){
			if(parsedContent[i].userId === testID){							
				data = parsedContent[i];
				break;
			}

		}
		
		//set the test value to the opposite so it will allways change the value
		if(data.public_data.presence){
			testValue = false;
		}
		else {
			testValue = true;
		}
			
		var options = {
			host: "localhost",
			path: "/update/"+testID+"/"+testValue,
			method: 'POST',
			port: '3000'
		};

		var req = http.request(options, function(res){
			console.log("Status code for test call = " + res.statusCode);	

			fsp.readFile("../settings/usersettings.json", {encoding:'utf8'}).then((contents) =>{
				var parsedContent = JSON.parse(contents);
				var data = null;

				for(var i = 0; i < parsedContent.length; i++){
					if(parsedContent[i].userId === testID){							
						data = parsedContent[i];
						break;
					}

				}

				if(data === null){
					console.log("Test user with id 1234 was not found. TEST FAILED.")
				}
				else if(data.public_data.presence){
					console.log("Data was successfully changed. TEST SUCCESSFUL.")
					console.log("Test Complete.")
				}
				else {
					console.log("Data was not successfully changed. TEST FAILED.")
				}


			});
		})

		req.end();	
		
			  
	});		
}

testRun();