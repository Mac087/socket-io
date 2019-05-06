function joinRoom(roomName) {
  // Send this room to the server, so the server can join/add the client to the room
  nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
    // We want to update the room member total now that we have joined!
    document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
  });

  nsScoket.on('historyCatchUp', history => {
    console.log(history);
  })
}