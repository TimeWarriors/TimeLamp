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
        
        let dataDiv = document.getElementById("dataDiv");
        
        for (var i = 0; i < data.length; i++){
            let img = document.createElement("img");
            img.id = "teachImg";
            let textName = document.createElement("p");
            var name = data[i].name.split("_").join(" ");
            textName.textContent = name;
            let teachDiv = document.createElement("div");
            teachDiv.id = "teachRes";
            let textDiv = document.createElement("div");
            textDiv.id = "teachText";
            
            img.src = data[i].img;
            dataDiv.appendChild(teachDiv);
            teachDiv.appendChild(img);
            teachDiv.appendChild(textDiv);
            textDiv.appendChild(textName)
            
            if(data[i].presence == true){
                
                teachDiv.style.backgroundColor = "YELLOWGREEN";
                // teachDiv.style.boxShadow = "10px 0 120px seagreen";
                // teachDiv.style.boxShadow = "10px 10px 250px seagreen"; 
                
            }
            else{
                teachDiv.style.backgroundColor = "FIREBRICK";
                
            }
            
        };
        
        
        
        
        
        
	});
	
	xhr.send();
	
	//console.log(JSON.parse("../settings/settings.json"))
}



console.log("hej test av github");
 window.onload = updatePresence;



// window.onload = function () {
//     updatePresence();
// }