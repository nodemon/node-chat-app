// for compatibility with old browsers dont use arrow function on client js

// user defined socket events
const evJOIN = 'join';
const evCLIENT_MESSAGE = 'createMessage';
const evSERVER_MESSAGE = 'newMessage';
const evCLIENT_MESSAGE_LOC = 'createLocationMessage';
const evSERVER_MESSAGE_LOC = 'newLocationMessage';
const evUSER_NAMES = 'userNames';

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

// first time chat page is loaded.. connection established with server
socket.on('connect', function () {
  // Retrieve parameters from URL
  var params = jQuery.deparam(window.location.search);

  // >>> JOIN Room
  socket.emit(evJOIN, params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
    else {
      console.log('No errors');
    }
  })

});

socket.on('disconnect', function () {
  console.log('disconnected to server')
});

socket.on(evUSER_NAMES, function (userNames) {
  // update user list
  var ul = jQuery('<ul></ul>');
  userNames.forEach( function (userName) {
    ul.append(jQuery('<li></li>').text(userName));
  });

  jQuery('#users').html(ul);
})

socket.on(evSERVER_MESSAGE, function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();  // html() returns markup inside
  var html = Mustache.render(template, {  // use mustache rendering instead of DOM manipulation as below
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


socket.on(evSERVER_MESSAGE_LOC, function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();  // html() returns markup inside
  var html = Mustache.render(template, {  // use mustache rendering instead of DOM manipulation as below
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


// Forms are old school . onsubmit does a full page refresh and adds data to the url as a query string
// We override the default behaviour using jquery
// listener method with e event as an argument
jQuery('#message_form').on('submit', function(e) {
  e.preventDefault(); // default behavour is page refresh

  var messageTextBox = jQuery('[name=message]');
  var text = messageTextBox.val();

  if (text.trim().length == 0) {
    return;
  }

  socket.emit(evCLIENT_MESSAGE, {
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
    socket.emit(evCLIENT_MESSAGE_LOC, {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });

})
