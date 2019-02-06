class Rooms {
  constructor() {
    this.rooms = [];
  }

  addRoom(roomName) {
    let room = roomName;
    this.rooms.push(room);
    this.rooms.sort();
    return room;
  }

  removeRoom(roomName) {
    let room = this.rooms.filter((room) => room === roomName)[0];

    if(room) {
      this.rooms = this.rooms.filter((room) => room !== roomName).concat(this.rooms.filter((room) => room === roomName)[1]).filter((room) => room !== undefined).sort();
    }

    console.log(this.rooms);
    return this.rooms;
  }
}

module.exports = {Rooms};
