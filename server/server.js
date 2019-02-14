const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Rooms} = require('./utils/rooms');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();
let rooms = new Rooms();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.emit('loadRoomList', rooms);

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name)) {
      return callback('Name is required.');
    } else if(!isRealString(params.room.toUpperCase()) && !params.select) {
      return callback('Room name is required.');
    } else if(params.select && !isRealString(params.select)) {
      return callback('egerg');
    } else if(params.select && !params.room) {
      params.room = params.select;
    }

    socket.join(params.room.toUpperCase());
    // socket.leave(room);

    // io.emit -> io.to('room').emit
    // socket.broadcast.emit -> socket.broadcast.to('room').emit
    // socket.emit
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room.toUpperCase());
    rooms.addRoom(params.room.toUpperCase());

    socket.emit('changeRoomTitle', params.room.toUpperCase());

    io.to(params.room.toUpperCase()).emit('updateUserList', users.getUserList(params.room.toUpperCase()));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app')); // To itself

    socket.broadcast.to(params.room.toUpperCase()).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); // To every connection
    }

    callback();

  });

  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
      rooms.removeRoom(user.room);
    }

  });
});


server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
