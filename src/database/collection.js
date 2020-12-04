'use strict';

const schema = require('./roomSchema');

class Collection {
  constructor() { }

  async createRoom(payload) {
    const room = new schema({ name: payload });
    await room.save();
    return room._id;
  }

  async join(roomID, payload) {
    const room = await schema.find({ _id: roomID });
    if (room[0].islocked && payload.password === room[0].password || !room[0].islocked) {
      room[0].pepole = [...room[0].pepole, { name: payload.name, avatar: payload.avatar }];
      await room[0].save();
      return room.messages;
    } else {
      return false;
    }
  }

  async exit(roomID, payload) {
    const room = await schema.find({ _id: roomID });
    console.log(payload.name, 'Left');
    room[0].pepole = room[0].pepole.filter(person => {
      return payload.name !== person.name;
    });
    await room[0].save();
  }

  async sendMessage(roomID, payload) {
    const room = await schema.find({ _id: roomID });
    room[0].messages.push({ name: payload.name, avatar: payload.avatar, text: [payload.text] });
    await room[0].save();
  }

  async resetPeople() {
    let rooms = await schema.find({});
    rooms.map(async (room) => {
      room.pepole = [];
      await room.save();
    });
  }
}


module.exports = new Collection();