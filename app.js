(function () {
    'use strict';
    var express = require('express'),
        app = express(),
        http = require('http').Server(app),
        io = require('socket.io')(http),
        users = [],
        shots = [];

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    app.use(express.static(__dirname + '/content'));

    app.get('/*', function (req, res, next) {
        var file = req.params[0];
        
        res.sendfile( __dirname + '/' + file );
    }); 

    var game_server = require('./content/js/server.js');

    io.on('connection', function (socket) {
        socket.on('novousuario', function (info) {
            users.push(info);

            io.emit('atualizausuarios', users);
        });
        socket.on('updatePosition', function (info) {
            socket.broadcast.emit('updatePosition', info);
        });
        socket.on('disconnect', function () {
            users.length = 0;
            socket.broadcast.emit('reconnect');
        });
        socket.on('addTiro', function (tiro) {
            shots.push(tiro);
            socket.broadcast.emit('addTiro', tiro);
        });
    });

    http.listen(process.env.PORT || 3000, function () {
        console.log('listening on port 3000');
    });
}());