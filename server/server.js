const path = require('path');
const http = require('http');
const express = require ('express');
const socketIO = require('socket.io');

var {generateMessage} = require('./utils/message.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4000;

/*
  Express and socket.io don't play well together but they are ok with the http module
  Follwing allows us to take advantage of socket.io and express on the same server
*/

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin','Welcome to chat app'));

  // send it to all sockets except the current socket
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);

    // for broadcast use io instead of socket
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from server');
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
})


server.listen(port, ()=> {
  console.log(`server up on port ${port}`);
});
