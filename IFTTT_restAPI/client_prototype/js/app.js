"use strict"; 

//not used atm. Tested when trying to read json file
var path = "../../../settings/settings.json";

function updatePresence(){
	
	var xhr = new XMLHttpRequest();
	//xhr.overrideMimeType("application/json");
	
	xhr.open("GET", "http://localhost:3000/userData");
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.addEventListener("load", function(res){
		
        
        let data = JSON.parse(xhr.responseText);
        
        console.log(data);
        
        
        
        let x = document.getElementById("dov");
        x.innerHTML = data[0].img;
        
        
	});
	
	xhr.send();
	
	//console.log(JSON.parse("../settings/settings.json"))
}



console.log("hej");
 window.onload = updatePresence;



// window.onload = function () {
//     updatePresence();
// }