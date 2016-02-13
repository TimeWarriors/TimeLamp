"use strict"; 

//not used atm. Tested when trying to read json file
var path = "../../../settings/settings.json";

function updatePresence(){
	
	var xhr = new XMLHttpRequest();
	//xhr.overrideMimeType("application/json");
	
	xhr.open("GET", "http://localhost:3000/userData");
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.addEventListener("load", function(res){
		console.log(JSON.parse(xhr.responseText));
	});
	
	xhr.send();
	
	//console.log(JSON.parse("../settings/settings.json"))
}

window.onload = updatePresence();