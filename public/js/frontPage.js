let socket = io();

socket.addEventListener('loadRoomList', function(rooms) {
  if(rooms.rooms.length > 0) {
    document.querySelector('#formSelect').style.display = 'block';

    let uniqueRoomsArray = function(rooms) {
      return rooms.filter(function(elem, pos,arr) {
        return arr.indexOf(elem) == pos;
      });
    };

    let selectRoom = document.querySelector('#selectRoom');
    selectRoom.innerHTML = '<option value="dafault" selected disabled>Join an existing room</option>';

    uniqueRoomsArray(rooms.rooms).forEach(function(room) {
      let option = document.createElement('option');
      option.value = room;
      option.innerText = room;

      // selectRoom.innerHTML = '<option value="dafault" selected>Join an existing room</option>';
      selectRoom.appendChild(option);
    });
  }
});
