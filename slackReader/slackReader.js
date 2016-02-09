"use strict"

let http = require('http');
let fsp = require('fs-promise');
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//fult string dependency
let swedishIsAtLocation = "Jag kom till";
let englishIsAtLocation = "I entered";




let slackReader = function(){

}

 

let getLecutrerStatus = function(channelID, callback){
	
	
	var options = {
		host:null,
		path:null,
		method:null
	};

	fsp.readFile('slackReaderSettings.json', {encoding : 'utf8'}).then((contents) =>{
		
		let parsedContent = JSON.parse(contents);				
	
		var options = {
			host:parsedContent.host,
			path:parsedContent.scope + "token="+ parsedContent.token +"&channel=C053AE0SB&count=1",
			method:'GET'
		};
		
		
		let xhr = new XMLHttpRequest();
		
		xhr.open("GET", parsedContent.host+parsedContent.scope + "token=" + parsedContent.token + "&channel=C053AE0SB&count=3");
	
		xhr.addEventListener("load", function(){
			var lastUpdate = JSON.parse(xhr.responseText).messages[0].attachments[0].text;

			if(lastUpdate.indexOf(swedishIsAtLocation) > -1 || lastUpdate.indexOf(englishIsAtLocation) > -1){
				console.log("Personen är på platsen")
				//callback(true);
			}
			else{
				console.log("personen är inte på platsen")
				//callback(false);
			}
		})

		xhr.send();

		/*let req = https.get(options, function(res){
			console.log("Inne i get")
			console.log(res.statusCode);
			console.log(JSON.stringify(res.headers));
			
			res.setEncoding('application/json');
			res.on('data', function(chunk){
				console.log("BODY: " + chunk);
			})
		
		})
		
		
		
		req.on('error', (e) =>{
			console.log('Error with request '+e.message)
		})
		
		req.on('end', () =>{
			console.log("all data collected")
		})*/
	});
	
		
	console.log("efter get")
}

getLecutrerStatus();



module.exports = slackReader;