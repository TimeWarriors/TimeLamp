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
        
        let x = document.getElementById("dataDiv");
        
        for (var i = 0; i < data.length; i++){
            let img = document.createElement("img");
            img.className = "teachImg";
            let textName = document.createElement("p");
            var name = data[i].name.split("_").join(" ");
            textName.textContent = name;
            let y = document.createElement("div");
            y.className = "teachRes";
            
            img.src = data[i].img;
            x.appendChild(y);
            y.appendChild(img);
            y.appendChild(textName)
            
            if(data[i].presence == true){
                
                y.style.backgroundColor = "seagreen";
                
            }
            else{
                y.style.backgroundColor = "#82002B";
            }
            
        };
        
        
        
        
        
        
	});
	
	xhr.send();
	
	//console.log(JSON.parse("../settings/settings.json"))
}



console.log("hej");
 window.onload = updatePresence;



// window.onload = function () {
//     updatePresence();
// }