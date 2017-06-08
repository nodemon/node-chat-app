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


socket.on('newLocationMessage', function(message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>') // target="_blank for opening in new tab
  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
})

// listener method with e event as an argument
jQuery('#message_form').on('submit', function(e) {
  e.preventDefault(); // default behavour is page refresh
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function() {

  })
});


var locationButton = jQuery('#send_location');
//listener below is same as ('#send_location').on() .. but will query DOM structure again
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }, function () {
    alert('Unable to fetch location');
  });

})
