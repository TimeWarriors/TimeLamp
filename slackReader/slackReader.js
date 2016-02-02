"use strict"
let slackReader = function(){

}

slackReader.prototype.getLecutrerStatus = function(){
	
	//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var statusWindow = document.getElementById("status");
	
	//var xhr1 = new XMLHttpRequest();
	//authenticate
	//Add
	var params = "client_id=3143650568.20094508496&scope=channels:history";	
	window.location = "https://slack.com/oauth/authorize?" + params; ///client_id:3143650568.20094508496_scope:read_redirect_uri:https://github.com/TimeWarriors
	//xhr1.open("GET", "http://slack.com/oauth/authorize/client_id")

    var xhr = new XMLHttpRequest();
    //xhr.open("GET", "https://slack.com/api/groups.history");
	xhr.open("GET", "https://slack.com/oauth/authorize?" + params);
	
    xhr.addEventListener("load", function(){
        console.log(xhr.responseText);
        statusWindow.innerHTML = xhr.responseText;
		console.log(xhr.getResponseHeader);
    })

    xhr.send();
}

module.exports = slackReader;