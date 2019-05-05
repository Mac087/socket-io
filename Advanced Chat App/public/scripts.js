const socket = io('http://localhost:9000');
const socket2 = io('http://localhost:9000/admin');

socket.on('messageFromServer', data => {
  console.log('socket: ', data);
  socket.emit('dataToServer', { data: 'Data from Client!' });
});

socket2.on('welcome', data => {
  console.log('socket2: ', data);
});

document.querySelector('#message-form').addEventListener('submit', event => {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socket.emit('newMessageToServer', { text: newMessage });
});