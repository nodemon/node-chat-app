const path = require('path');
const http = require('http');
const express = require ('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4000;

// user defined socket events
const evJOIN = 'join';
const evCLIENT_MESSAGE = 'createMessage';
const evSERVER_MESSAGE = 'newMessage';
const evCLIENT_MESSAGE_LOC = 'createLocationMessage';
const evSERVER_MESSAGE_LOC = 'newLocationMessage';
const evUSER_NAMES = 'userNames';
const evGET_ROOM_NAMES = 'getRoomNames';
const evCREATE_ROOM = 'createRoom';

/*
  Express and socket.io don't play well together but they are ok with the http module
  Follwing allows us to take advantage of socket.io and express on the same server
*/

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

var users = new Users();

var roomNames = [];

io.on('connection', (socket) => {

  // REQUEST for Existing rooms
  socket.on(evGET_ROOM_NAMES, (params, callback) => {
    callback(roomNames);
  });

  // Create Room
  socket.on(evCREATE_ROOM, (roomName, callback) => {
    if (roomNames.find((room) => room.toLowerCase() === roomName.toLowerCase())) {
      callback('Room already exists')
    }
    else {
      roomNames.push(roomName)
      callback();
    }
  });

  // <<< JOIN Room
  socket.on(evJOIN, (params, callback) => {
    var userName = params.name;
    var roomName = params.room;

    if (!isRealString(userName) || !isRealString(roomName)) {
      return callback ('Name and Room name are required');
    }

    if (userName.toLowerCase() === 'admin') {
      return callback ('Cannot use Admin');
    }

    var user = users.getUserByName(userName);

    // user already exists
    if (user) {
      return callback ('Display name already taken');
    }

    var existingRoom = roomNames.find((room) => room.toLowerCase() === roomName.toLowerCase());
    if (!existingRoom) {
      roomNames.push(roomName);
    }

        // socket.leave(roomName) - to leave room
        // io.to(roomName).emit() - broadcast to room
        // socket.broadcast.to(roomName).emit() - everyone in room except user

    socket.join(params.room);
    users.addUser(socket.id, params.name, params.room);

    console.log(`${params.name} joined ${params.room}`);

    // >>> WELCOME Message
    socket.emit(evSERVER_MESSAGE, generateMessage('Admin',`Welcome to ${roomName}`));

    // >>> USER Joined - send it to all sockets in room except the current socket
    socket.broadcast.to(params.room).emit(evSERVER_MESSAGE, generateMessage('Admin', `${params.name} joined`));

    // >>> USERLIST
    io.to(params.room).emit(evUSER_NAMES, users.getUserNames(params.room));

    callback();
  })

  socket.on(evCLIENT_MESSAGE, (message, callback) => {

    // >>> Broadcast user message - for broadcast use io instead of socket
    if(isRealString(message.text)) {
      var user = users.getUser(socket.id);
      io.to(user.room).emit(evSERVER_MESSAGE, generateMessage(user.name, message.text));
    }
  })


  socket.on(evCLIENT_MESSAGE_LOC, (coords) => {
    var user = users.getUser(socket.id);
    io.to(user.room).emit(evSERVER_MESSAGE_LOC, generateLocationMessage(user.name, coords.latitude, coords.longitude));
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      // >>> USERLIST
      io.to(user.room).emit(evUSER_NAMES, users.getUserNames(user.room));

      // >>> USER Left
      io.to(user.room).emit(evSERVER_MESSAGE, generateMessage('Admin', `${user.name} left`));

      console.log(`${user.name} left ${user.room}`);
    }

  })
})


server.listen(port, ()=> {
  console.log(`server up on port ${port}`);
});
