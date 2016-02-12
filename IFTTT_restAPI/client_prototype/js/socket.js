var socket = io();

socket.on('statusUpdated', function(userData){
	console.log(userData);
})