'use strict';

const schema = require('./roomSchema');

class Collection {
  constructor() { }

  async createRoom(payload) {
    const room = new schema(payload);
    await room.save();
  }

  async join(roomID, payload) {
    const room = await schema.find({ _id: roomID });
    if (room.islocked && payload.password === room.password || !room.islocked) {
      room.pepole = [...room.pepole, { name: payload.name, avatar: payload.avatar }];
      await room.save();
      return room.messages;
    } else {
      return false;
    }
  }

  async exit(roomID, payload) {
    const room = await schema.find({ _id: roomID });
    room.pepole = room.pepole.filter(person => {
      return payload.name !== person.name;
    });
    await room.save();
  }

  async sendMessage(roomID, payload) {
    const room = await schema.find({ _id: roomID });
    if (room.messages[room.messages.length - 1].name === payload.name) {
      room.messages[room.messages.length - 1].text.push(payload.text);
    } else {
      room.messages = [...room.messages, { name: payload.name, avatar: payload.avatar, text: [payload.text] }];
    }
  }
}


module.exports = new Collection();