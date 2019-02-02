let socket = io();
const messages = document.querySelector('#messages');

socket.addEventListener('connect', function() {
  console.log('Connected to server');
});

socket.addEventListener('disconnect', function() {
  console.log('Disconnected from server');
});

socket.addEventListener('newMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = document.querySelector('#messageTemplate').innerHTML;
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  messages.innerHTML += html;
});

socket.addEventListener('newLocationMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = document.querySelector('#locationMessageTemplate').innerHTML;
  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  messages.innerHTML += html;
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
