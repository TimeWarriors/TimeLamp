'use strict';

const port = 3334;
const message = 'message';
const remove = 'remove';
const highlight = 'highlight';
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const eventEmitter = require('../eventEmitter/eventEmitter.js');
const emitter = eventEmitter.getEventEmitter();
const router = express.Router();

/**
 * [generate random string]
 * @param  {[int]} length [length of string]
 * @return {[string]}        [random string]
 */
const generateRandomString = (length) => {
    let result = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return result;
};

/**
 * [creates object to send to clients]
 * @param  {[onject]} data [start object to build upon]
 * @return {[object]}      [object]
 */
const buildClientObject = (data) => {
    data.uniqId = generateRandomString(32);
    data.highlight = false;
    return data;
};

/**
 * [checks if string contains i]
 * @param  {[string]} i      [word ]
 * @param  {[string]} string [string to check in]
 * @return {[bool]}          [if string contains i or not]
 */
const isChanelOpen = (i, string) => {
    let reg = new RegExp(i, 'i');
    return string.match(reg);
};

app.engine('.hbs', exphbs({
    extname: '.hbs',
    partialsDir: __dirname + '/public/partials',
    layoutsDir: __dirname + '/public/layouts'
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,'/public/layouts'));

app.use(express.static(__dirname + '/public'));
app.use('/', router);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

/* Starts server */
const io = require('socket.io').listen(app.listen(port, function(){
    console.log('Listening on', port);
}));

/**
 * [sends mesasge to specific room]
 */
const sendMessageToRoom = (room, id, data) => {
    io.sockets.in(room).emit(id, data);
};

emitter.on('userQuestion', (data) => {
    for (let i in io.sockets.adapter.rooms) {
        if (io.sockets.adapter.rooms.hasOwnProperty(i)) {
            if(isChanelOpen(i, data.channelName)){
                sendMessageToRoom(i, message, buildClientObject(data));
            }
        }
    }
});
// admin view
router.get('/admin/course/:courseId', function(req, res) {
    res.render('admin', {
        courseId: req.params.courseId,
        item: '{{item.text}}',
        index: '{{index}}'
    });
});
// tv view
router.get('/tv/course/:courseId', function(req, res) {
    res.render('tv', {
        courseId: req.params.courseId,
        item: '{{item.text}}',
        index: '{{index}}'
    });
});

io.sockets.on('connection', function (socket) {

    socket.on('chanel', function(chanel) {
       socket.join(chanel);
    });
    // revert old message
    socket.on('revert', function(data){
        sendMessageToRoom(data.room, message, data.item);
    });
    // remove message
    socket.on('remove', function(data){
        sendMessageToRoom(data.room, remove, data.uniqId);
    });
    // highlight a message
    socket.on('highlight', function(data){
        sendMessageToRoom(data.room, highlight, data.uniqId);
    });
});
