// for compatibility with old browsers dont use arrow function on client js

// Forms are old school . onsubmit does a full page refresh and adds data to the url as a query string -->
// We override the default behaviour using jquery -->

var socket = io();

function scrollToBottom() {
  var messages = jQuery('#messages');
  var clientHeight = messages.prop('clientHeight'); // prop() cross-browser way of getting a property
  var scrollTop = messages.prop('scrollTop'); // current top of the scroll.. 0 when an top
  var scrollHeight = messages.prop('scrollHeight'); // total height of the container

  var newMessage = messages.children('li:last-child');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  var threshold = newMessageHeight + lastMessageHeight; // beyond this threshold dont autoscroll..

  if (scrollTop > scrollHeight-clientHeight-threshold) {
    messages.scrollTop(scrollHeight-clientHeight); // set scrollTop to total height : bring to bottom
  }
}

socket.on('connect', function () {
  console.log('connected to server');

});

socket.on('disconnect', function () {
  console.log('disconnected to server')
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();  // html() returns markup inside
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();


  // var formattedTime = moment(message.createdAt).format('h:mm a');
  // var li = jQuery('<li></li>'); // creating an element using jQuery
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  //
  // jQuery('#messages').append(li);
});


socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();  // html() returns markup inside
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();




  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>') // target="_blank for opening in new tab
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
})

// listener method with e event as an argument
jQuery('#message_form').on('submit', function(e) {
  e.preventDefault(); // default behavour is page refresh

  var messageTextBox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val(''); // clear
  })
});


var locationButton = jQuery('#send_location');
//listener below is same as ('#send_location').on() .. but will not query DOM structure again
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location ...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });

})
