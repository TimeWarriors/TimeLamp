var socket = io();

    socket.on('statusUpdated', function(userData){
	console.log(userData);
    console.log("hejsan2");
    var teachRes = document.getElementById(userData.name);
    
    if(userData.presence == true){
        // teachRes.style.backgroundColor = "#ADFF2F";
            teachRes.className = "teachResPresent";
            }
            else{
                // teachRes.style.backgroundColor = "#B22222";
                teachRes.className = "teachResNotPresent";
            }
})
