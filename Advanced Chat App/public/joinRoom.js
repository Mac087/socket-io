function joinRoom(roomName) {
  // Send this room to the server, so the server can join/add the client to the room
  nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
    // We want to update the room member total now that we have joined!
    document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
  });

  nsSocket.on('historyCatchUp', history => {
    const messagesUl = document.querySelector('#messages');
    messagesUl.innerHTML = "";
    history.forEach(msg => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMsg;
    });
    messagesUl.scrollTo(0, messagesUl.scrollHeight);
  });

  nsSocket.on('updateMembers', numMembers => {
    document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector('.curr-room-text').innerText = roomName;
  });

  // Implement search functionality (pure JS)
  let searchBox = document.querySelector('#search-box');
  searchBox.addEventListener('input', e => {
    let messages = Array.from(document.getElementsByClassName('message-text'));
    messages.forEach(msg => {
      if (msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) { // we can't use includes because we are only searching for a portion of the string
        // The  msg does not contain the user search term!
        msg.style.display = "none";
      } else {
        msg.style.display = "block";
      }
    });
  });
}