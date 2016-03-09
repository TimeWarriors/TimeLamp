'use strict';

const clear = require('cli-clear');
clear();
clear();

const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const eventEmitter = require('../eventEmitter/eventEmitter.js');
const emitter = eventEmitter.getEventEmitter();

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: __dirname + '/public/layouts/index.hbs',
    partialsDir: __dirname + '/public/partials',
    layoutsDir: __dirname + '/public/layouts'
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,'/public/layouts'));

const router = express.Router();

app.use(express.static(__dirname + '/public'));
app.use('/', router);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});


/*
{ type: 'message',
 channel: 'G0JTV0Z2A',
 user: 'U0JTRPWCD',
 text: '#? test',
 ts: '1457438526.000002',
 team: 'T0347K4GQ',
 hashTags: [ '#?' ],
 channelName: 1dv411-projekt }
 */

/**===TEST===**/

let iterator = 0;
let testO = {
    type: 'message',
    channel: 'G0JTV0Z2A',
    user: 'U0JTRPWCD',
    text: '#? mess :'+iterator,
    ts: '1457438526.000002',
    team: 'T0347K4GQ',
    hashTags: [ '#?' ],
    channelName: '1dv411-projekt'
};

let test1 = {
    type: 'message',
    channel: 'G0JTV0Z2A',
    user: 'U0JTRPWCD',
    text: '#? bajs medelande',
    ts: '1457438526.000002',
    team: 'T0347K4GQ',
    hashTags: [ '#?' ],
    channelName: '1dv420-bajs'
};

setInterval(() => {
    testO.text += iterator;
    emitter.emit('userQuestion', testO);
    iterator++;
}, 4000);
/***/



const io = require('socket.io').listen(app.listen(3334, function(){
    console.log('Listening');
}));



const message = 'message';
const remove = 'remove';
const highlight = 'highlight';

const sendMessageToRoom = (room, id, data) => {
    io.sockets.in(room).emit(id, data);
};

const generateRandomString = (length) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const buildClientObject = (data) => {
    data.uniqId = generateRandomString(32);
    data.highlight = false;
    return data;
};

const isChanelOpen = (i, channelName) => {
    let reg = new RegExp(i, 'i');
    return channelName.match(reg);
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

// req.params.roomId
router.get('/admin/course/:courseId', function(req, res) {
    res.render('index', {
        courseId: req.params.courseId,
        item: '{{item.text}}',
        index: '{{index}}',
        admin: true
    });
});

router.get('/tv/course/:courseId', function(req, res) {
    res.render('index', {
        courseId: req.params.courseId,
        item: '{{item.text}}',
        index: '{{index}}',
        admin: false
    });
});

let i = 0;
io.sockets.on('connection', function (socket) {

    socket.on('chanel', function(chanel) {
       socket.join(chanel);
    });

    socket.on('remove', function(data){
        sendMessageToRoom(data.room, remove, data.uniqId);
    });

    socket.on('highlight', function(data){
        sendMessageToRoom(data.room, highlight, data.uniqId);
    });
});

/*io.sockets.on('disconnect', function () {
   console.log('disconnect client event....');
});*/
