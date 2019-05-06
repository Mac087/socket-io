const express = require('express');
const socketio = require('socket.io');

const app = express();

let namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

//app.listen(9000);
const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', socket => { //io.on === io.of('/').on

  // build an array to send back with the img and endpoint for each NS
  let nsData = namespaces.map(ns => ({ img: ns.img, endpoint: ns.endpoint }));

  // Send the nsData back to the client. We need to use socket, NOT io, because we want
  // it to go to just this client.
  socket.emit('nsList', nsData);

});

// loop through each namespace and listen for a connection
namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on('connection', nsSocket => {
    console.log(`${nsSocket.id} has join ${namespace.endpoint}`);

    // A socket has connected to one of our chatgroup namespaces.
    // send that ns group info back
    nsSocket.emit('nsRoomLoad', namespace.rooms);
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      // deal with history...once we have it
      nsSocket.join(roomToJoin);
      io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        numberOfUsersCallback(clients.length);
      });

      const nsRoom = namespace.rooms.find(room => room.roomTitle === roomToJoin);
      nsSocket.emit('historyCatchUp', nsRoom.history);

      // Send back the number of users in this room to ALL sockets connected to this room
      io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
      });
    });

    nsSocket.on('newMessageToServer', msg => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: 'rbunch',
        avatar: 'https://via.placeholder.com/30'
      };
      // Send this message to ALL the sockets that are in the room that THIS socket is in.
      // how can we find out what room THIS socket is in?
      // console.log(nsSocket.rooms);
      // The user will be in the 2nd room in the object list. This is because the socket ALWAYS
      // joins its own room on connection.
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      // We need to find the Room object for this room
      const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);
      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
});