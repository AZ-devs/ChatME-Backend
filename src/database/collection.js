'use strict';

const schema = require('./roomSchema');
const usernameSchema = require('./usernameSchema');


class Collection {
  constructor() { }

  async createRoom(payload) {
    const obj = payload.password === '' ? { name: payload.roomName } : { name: payload.roomName, password: payload.password, islocked: true };
    const room = new schema(obj);
    await room.save();
    return room._id;
  }

  async join(roomID, payload) {
    const room = await schema.find({ _id: roomID });
    if (room[0].islocked && payload.password === room[0].password || !room[0].islocked) {
      console.log(payload.name, 'joined room:', payload.roomID);
      room[0].pepole = [...room[0].pepole, { name: payload.name, avatar: payload.avatar }];
      await room[0].save();
      return room[0].messages ? room[0].messages : [];
    } else {
      return false;
    }
  }

  async getMsg(roomID) {
    const room = await schema.find({ _id: roomID });
    return room[0].messages ? room[0].messages : [];

  }

  async exit(roomID, payload) {
    const room = await schema.find({ _id: roomID });
    console.log(payload.name, 'leaved room:', roomID);
    room[0].pepole = room[0].pepole.filter(person => {
      return payload.name !== person.name;
    });
    await room[0].save();
  }

  async sendMessage(roomID, payload) {
    const room = await schema.find({ _id: roomID });
    room[0].messages = [...room[0].messages, { name: payload.name, avatar: payload.avatar, text: payload.text }];
    await room[0].save();
    return room[0].messages;
  }

  async allRooms() {
    let rooms = await schema.find({});
    let roomsDetails = rooms.map(room => {
      return { _id: room._id, name: room.name, pepole: room.pepole, islocked: room.islocked };
    });
    return roomsDetails.sort((a, b) => b.pepole.length - a.pepole.length);
  }

  async resetPeople() {
    let rooms = await schema.find({});
    rooms.map(async (room) => {
      room.pepole = [];
      await room.save();
    });
  }

  async checkname(username) {
    let flag = await usernameSchema.find({ name: username });
    if (flag.length === 0) {
      const user = new usernameSchema({ name: username });
      await user.save();
      return true;
    }
    return false;
  }

}


module.exports = new Collection();