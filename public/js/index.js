// for compatibility with old browsers dont use arrow function on client js

var socket = io();
socket.on('connect', function () {
  console.log('connected to server');
  socket.emit('createMessage', {
    to: 'Jen',
    text: 'hey'
  });
});

socket.on('disconnect', function () {
  console.log('disconnected to server')
});

socket.on('newMessage', function (message) {
  console.log('New message', message);
})