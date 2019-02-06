let socket = io();

socket.addEventListener('loadRoomList', function(rooms) {
  if(rooms.rooms.length > 0) {
    document.querySelector('#formSelect').style.display = 'block';

    let uniqueRoomsArray = function(rooms) {
      return rooms.filter(function(elem, pos,arr) {
        return arr.indexOf(elem) == pos;
      });
    };

    console.log(uniqueRoomsArray(rooms.rooms));
    console.log(rooms);

    let selectRoom = document.querySelector('#selectRoom');
    selectRoom.innerHTML = '';

    uniqueRoomsArray(rooms.rooms).forEach(function(room) {
      let option = document.createElement('option');
      option.value = room;
      option.innerText = room;

      selectRoom.appendChild(option);
    });
  }
});
