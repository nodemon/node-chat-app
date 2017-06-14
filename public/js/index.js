var nameText = $("#name");
var roomSel = $("#room");
var createRoomText = $("#create_room");

var btnCreate = $("#btn_create");

function onBlur() {
  $(this).css("background-color", "#ffffff");
}
function onFocus() {
  $(this).css("background-color", "#cccccc");
}

nameText.blur(onBlur);
nameText.focus(onFocus);

createRoomText.blur(onBlur);
createRoomText.focus(onFocus);

roomSel.blur(onBlur);
roomSel.focus(onFocus);


//  if (nameTextBox.val().trim().length>0) {
//  btn_join.disabled = false;

var socket = io();

const evGET_ROOM_NAMES = 'getRoomNames';
const evCREATE_ROOM = 'createRoom';

// first time index page is loaded.. connection established with server
socket.on('connect', function () {
  loadRoomNames();
});

socket.on('disconnect', function () {
  console.log('disconnected to server')
});

function loadRoomNames () {
  // after connection is established fetch room names
  socket.emit(evGET_ROOM_NAMES, null, function(roomNames) {

    roomSel.html('');

    if (roomNames && roomNames.length>0) {
      roomNames.forEach(function (roomName) {
        roomSel.append( $('<option>', {
          value: roomName,
          text: roomName
        }));
      })
    }

    console.log(roomNames);
  })
}

function createRoom () {
  var roomName = createRoomText.val();
  if (!isRealString(roomName)) {
    return;
  }

  roomName = roomName.trim();
  console.log('Create Room ', roomName );

  socket.emit(evCREATE_ROOM, roomName, function(err) {
    createRoomText.val('');

    if (err) {
      alert(err);
    }
    else {
      loadRoomNames();
    }
  });
}

jQuery('#form_login').on('submit',
  function(e) {

    var displayName = nameText.val();
    var roomName = roomSel.val();
    if (!isRealString(displayName) || !isRealString(roomName)) {
      e.preventDefault(); // prevent form submit
      return;
    }
  }
);


function isRealString (str) {
  return typeof str === 'string' && str.trim().length >0;
}
