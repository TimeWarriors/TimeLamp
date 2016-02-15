var socket = io();

    socket.on('statusUpdated', function(userData){
	console.log(userData);
    console.log("hejsan2");
    var teachRes = document.getElementById("teachRes");
    
    if(userData.presence == true){
        teachRes.style.backgroundColor = "#ADFF2F";
            }
            else{
                teachRes.style.backgroundColor = "#B22222";
            }
    
})
