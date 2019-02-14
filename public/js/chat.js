let socket = io();
const messages = document.querySelector('#messages');

function scrollToBottom() {
  // Selector
  let messagesContent = jQuery('#messages');
  let newMessage = messagesContent.children('li:last-child');

  // Heights
  let clientHeight = messagesContent.prop('clientHeight');
  let scrollTop = messagesContent.prop('scrollTop');
  let scrollHeight = messagesContent.prop('scrollHeight');
  let newMessageHeigth = newMessage.innerHeight();
  let lastMessageHeigth = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeigth + lastMessageHeigth >= scrollHeight) {
    messages.scrollTo(0, scrollHeight)
  }
}

socket.addEventListener('connect', function() {
  let params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.addEventListener('disconnect', function() {
  console.log('Disconnected from server');
});

socket.addEventListener('changeRoomTitle', function(roomTitle) {
  let title = document.querySelector('#roomTitle');

  title.innerText = roomTitle;
});

socket.addEventListener('updateUserList', function(users) {
  let ul = jQuery('<ul></ul>');

  users.forEach(function(user) {
    ul.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ul);

  highlightOwn();
});

function highlightOwn() {
  // console.log(jQuery.deparam(window.location.search).name);

  let li = document.querySelectorAll('#users ul li');

  for(let i = 0; i < li.length; i++) {
    if(li[i].innerText === jQuery.deparam(window.location.search).name) {
      li[i].style.fontWeight = 'bold';
    }
  }
}

socket.addEventListener('newMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = document.querySelector('#messageTemplate').innerHTML;
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  messages.innerHTML += html;
  scrollToBottom();
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
  scrollToBottom();
});

document.querySelector('#messageForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var messageInput = document.querySelector('#messageInput');

  socket.emit('createMessage', {
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
