let socket = io();
const messages = document.querySelector('#messages');

socket.addEventListener('connect', function() {
  console.log('Connected to server');
});

socket.addEventListener('disconnect', function() {
  console.log('Disconnected from server');
});

socket.addEventListener('newMessage', function(message) {
  console.log('New message', message);
  let li = document.createElement('li');
  li.innerText = `${message.from}: ${message.text}`;

  messages.appendChild(li);
});

socket.addEventListener('newLocationMessage', function(message) {
  let li = document.createElement('li');
  let a = document.createElement('a');

  li.innerText = `${message.from}: `;
  a.innerText = 'My current location';
  a.setAttribute('target', '_blank');
  a.setAttribute('href', message.url);
  li.appendChild(a);
  messages.appendChild(li);
});

document.querySelector('#messageForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var messageInput = document.querySelector('#messageInput');

  socket.emit('createMessage', {
    from: 'User',
    text: messageInput.value
  }, function() {
    messageInput.value = '';
  });
});

let locationButton = document.querySelector('#sendLocation');
locationButton.addEventListener('click', function() {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.disabled = true;
  locationButton.innerText = 'Sending location...';

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.disabled = false;
    locationButton.innerText = 'Send Location';
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationButton.disabled = false;
    locationButton.innerText = 'Send Location';
    alert('Unable to fetch location.');
  });
});
