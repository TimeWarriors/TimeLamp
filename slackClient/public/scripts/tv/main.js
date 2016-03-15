'use strict';

var client = client || {};
var socket = io();
client.id = null;
client.nrOfMessagesOnScreen = 4;

client.init = function(){

    client.id = document.querySelector('#courseId').dataset.courseId;
    client.connect();
    var listView = client.listView();
    
    client.onMessage(listView.updateMessages);
    client.onRemove(listView.removeMessage);
    client.onHighlight(listView.highlightMessage);
};

client.connect = function(){
    socket.on('connect', function() {
        socket.emit('chanel', client.id);
    });
};

client.emit = function(chanel, data){
    socket.emit(chanel, data);
};

client.onMessage = function(fn) {
    socket.on('message', function(data) {
        fn(data);
    });
};

client.onRemove = function(fn) {
    socket.on('remove', function(data) {
        fn(data);
    });
};

client.onHighlight = function(fn) {
    socket.on('highlight', function(data) {
        fn(data);
    });
};

window.onload = client.init();
