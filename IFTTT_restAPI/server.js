var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fsp = require("fs-promise");
var lightHandler = require('../lightHandler/lightHandler');
var lh = new lightHandler();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = "../settings/";
var fileName = "usersettings.json"

app.use(bodyParser.json());
app.use(express.static(__dirname + "/client_prototype"))

//Filler page
app.get('/', function(req, res){	
	fsp.readFile(__dirname + "client_prototype/index.html", {encoding:'utf8'}).then((contents) =>{
		res.send(contents.toString());
	});
	//res.send("<!doctype html><html><head><meta charset='utf-8' /><title>Blink RESTApi</title></head><body>Lorem Ipsum</body></html>");
});

//returns public data from a user
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
				
				var content = parsedContent[i].public_data; //Jävla javascript ibland.
						
				console.log("before overwrite.");
				fsp.writeFile(path + fileName, JSON.stringify(parsedContent)).then(() =>{
					
					io.emit('statusUpdated', content);
					res.send("Done.");
				});
			}
		}
	});
});

//test code
io.on('connection', function(socket){

	
	
	console.log("a user conned.");
})
//--

io.on('update', function(){
	console.log("io")
})

http.listen(3000, function(){
	console.log("listening on 3k");
});