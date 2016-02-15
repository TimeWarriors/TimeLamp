var socket = io();



socket.on('statusUpdated', function(userData){
	console.log(userData);
    console.log("hejsan2");
    
    var teachRes = document.getElementById("teachRes");
    
    if(userData.presence == true){
                
                teachRes.style.backgroundColor = "#ADFF2F";
                // teachDiv.style.boxShadow = "10px 0 120px seagreen";
                // teachDiv.style.boxShadow = "10px 10px 250px seagreen"; 
                
            }
            else{
                teachRes.style.backgroundColor = "#B22222";
                
            }
    
})

// socket.on('statusUpdated', function(userData){
//   socket.on('event', function(userData){
//       console.log("hejsaaa");
//   }
  
//   );
//   socket.on('disconnect', function(){});
// });
// server.listen(3000);