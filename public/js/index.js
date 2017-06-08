// for compatibility with old browsers dont use arrow function on client js

var socket = io();
socket.on('connect', function () {
  console.log('connected to server');

});

socket.on('disconnect', function () {
  console.log('disconnected to server')
});

socket.on('newMessage', function (message) {
  console.log('New message', message);
  var li = jQuery('<li></li>'); // creatting an element using jQuery
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});


// listener method with e event as an argument
jQuery('#message_form').on('submit', function(e) {
  e.preventDefault(); // default behavour is page refresh
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function() {

  })
})
