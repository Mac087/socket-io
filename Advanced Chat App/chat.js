const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/public'));

//app.listen(9000);
const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', socket => { //io.on === io.of('/').on
  socket.emit('messageFromServer', { data: 'Welcome to the socketio server' });
  socket.on('messageToServer', msg => {
    console.log(msg);
  });
});

io.of('/admin').on('connection', socket => {
  // io.of('/admin').emit('welcome', 'Welcome to the admin channel!');
  socket.emit('welcome', 'Welcome to the admin channel!');
});