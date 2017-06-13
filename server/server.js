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

/*
  Express and socket.io don't play well together but they are ok with the http module
  Follwing allows us to take advantage of socket.io and express on the same server
*/

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

var users = new Users();

io.on('connection', (socket) => {
  console.log('New user connected');

  // <<< JOIN Room
  socket.on(evJOIN, (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback ('Name and Room name are required');
    }

        // socket.leave(roomName) - to leave room
        // io.to(roomName).emit() - broadcast to room
        // socket.broadcast.to(roomName).emit() - everyone in room except user

    socket.join(params.room);
    users.addUser(socket.id, params.name, params.room);

    // >>> WELCOME Message
    socket.emit(evSERVER_MESSAGE, generateMessage('Admin','Welcome to chat app'));

    // >>> USER Joined - send it to all sockets in room except the current socket
    socket.broadcast.to(params.room).emit(evSERVER_MESSAGE, generateMessage('Admin', `${params.name} joined`));

    // >>> USERLIST
    io.to(params.room).emit(evUSER_NAMES, users.getUserNames(params.room));

    callback();
  })

  socket.on(evCLIENT_MESSAGE, (message, callback) => {

    // >>> Broadcast user message - for broadcast use io instead of socket

    var user = users.getUser(socket.id);
    io.emit(evSERVER_MESSAGE, generateMessage(user.name, message.text));
    callback('This is from server');
  })


  socket.on(evCLIENT_MESSAGE_LOC, (coords) => {
    var user = users.getUser(socket.id);
    io.emit(evSERVER_MESSAGE_LOC, generateLocationMessage(user.name, coords.latitude, coords.longitude));
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    // >>> USERLIST
    io.to(user.room).emit(evUSER_NAMES, users.getUserNames(user.room));

    // >>> USER Left
    io.to(user.room).emit(evSERVER_MESSAGE, generateMessage('Admin', `${user.name} left`));

    console.log('User disconnected');
  })
})


server.listen(port, ()=> {
  console.log(`server up on port ${port}`);
});
