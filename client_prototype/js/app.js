"use strict";

var path = "../settings/settings.json";

function updatePresence(){
	
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open("GET", path);
	xhr.addEventListener("load", function(){
		console.log(JSON.parse(xhr.responseText));
	});
	
	xhr.send(null);
	
	//console.log(JSON.parse("../settings/settings.json"))
}

window.onload = updatePresence();