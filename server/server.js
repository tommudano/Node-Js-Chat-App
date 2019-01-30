const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit('newEmail', {
  //   from: 'mike@example.com',
  //   text: 'Hey. What is going on?',
  //   createdAt: 123
  // });

  socket.emit('newMessage', {
    from: 'Tom',
    text: 'Hi! How are you?',
    createdAt: 123456
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail);
  // });

  socket.on('createMessage', (newMessage) => {
    console.log('createMessage', newMessage);
  });

});


server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
