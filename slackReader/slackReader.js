"use strict"
let slackReader = function(){

}

slackReader.prototype.getLecutrerStatus = function(){
	
	//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    
	
	//var xhr1 = new XMLHttpRequest();
	//authenticate
	//Add
	var settings = getSlackSettings();
	var params = "client_id="+getSlackSettings().clientID+"&scope=" + getSlackSettings().scope;	
	window.location = "https://slack.com/oauth/authorize?" + params; ///
	//xhr1.open("GET", "http://slack.com/oauth/authorize/")

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