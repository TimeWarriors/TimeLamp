var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fsp = require("fs-promise");

var http = require('http').Server(app);
var test = require('http');
var io = require('socket.io')(http);

var scheduleHandler = require('./scheduleHandler.js');
var sH = new scheduleHandler();

var path = "../settings/";
var fileName = "usersettings.json";

app.use(bodyParser.json());
app.use(express.static(__dirname + "/client_prototype"))

//returns the index page for the client
app.get('/', function(req, res){	
	fsp.readFile(__dirname + "client_prototype/index.html", {encoding:'utf8'}).then((contents) =>{
		res.send(contents.toString());
	});
});

//returns public data from all registerd user in usersettings.json
app.get("/userData", function(req, res){
	var data = [];
	
	fsp.readFile(path + fileName, {encoding:'utf8'}).then((contents) =>{
		var parsedContent = JSON.parse(contents);

		for(var i = 0; i < parsedContent.length; i++){
			data.push(parsedContent[i].public_data);
		}
		
		res.send(data);		
	});	
})


//Sets the presence in the settings JSON file to the users current presence.
app.post('/update/:id/:presence', function(req, res){
	
	//NOTE: since presence is sent as param it is a string and not a booelean.
	var data = {
		id: req.params.id,
		presence: req.params.presence
	};
	
	
	fsp.readFile(path+fileName, {encoding:'utf8'}).then((contents) =>{
		var parsedContent = JSON.parse(contents);	

		for (var i = 0; i < parsedContent.length; i++){

			if(parsedContent[i].userId === data.id){
				
				if(data.presence === "false"){
					parsedContent[i].public_data.presence = false;
				}
				else if(data.presence === "true"){
					parsedContent[i].public_data.presence = true;
				}
				
				//public data for a user that had his/ her status just updated.
				var content = parsedContent[i].public_data; //Jävla javascript ibland.
						
				fsp.writeFile(path + fileName, JSON.stringify(parsedContent)).then(() =>{
					//and the public data is emitted so the status can be updated in real time.
					io.emit('statusUpdated', content);
					console.log("Status updated.");
				});
			}
		}
	});
});



http.listen(3000, function(){
<<<<<<< HEAD
	console.log("listening on port 3000");
});
=======
	console.log("listening on 3k");
});

test.createServer(function(req, res){
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write("test av server");
    res.end('It works');
}).listen(3000, '194.47.106.229');
>>>>>>> master
