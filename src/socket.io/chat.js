'use strict';
const collection = require('../database/collection');

const { chat } = require('../server');

chat.on('connection', async (socket) => {
  console.log(socket.id, 'connected');
  let roomsDetails = await collection.allRooms();
  chat.to(socket.id).emit('lobby', roomsDetails);

  socket.on('join', async (payload) => {// name , rommID , password , avatar
    socket.exitHandler = { name: payload.name, roomID: payload.roomID };
    console.log('1111', payload);
    const messages = await collection.join(payload.roomID, payload);
    if (messages !== false) {
      console.log(socket.id, ' joined room:', payload.roomID);
      socket.join(payload.roomID);
      let roomsDetails = await collection.allRooms();
      chat.emit('lobby', roomsDetails);
      chat.to(socket.id).emit('joinLocked', {});
      chat.to(socket.id).emit('messages', messages);
    }
  });

  socket.on('exit', async (payload) => {// rommID , name
    await collection.exit(payload.roomID, payload);
    socket.leave(payload.roomID);
    let roomsDetails = await collection.allRooms();
    chat.emit('lobby', roomsDetails);
  });

  socket.on('sendMessage', async (payload) => {// roomID , name , avatar , text
    const result = await collection.sendMessage(payload.roomID, payload);
    chat.to(payload.roomID).emit('messages', result);
  });

  socket.on('createRoom', async (payload) => {// name , roomName , password , avatar
    const roomID = await collection.createRoom(payload);
    payload.roomID = roomID;
    chat.to(socket.id).emit('createdRoom', payload);
  });

  socket.on('disconnect', async () => {
    if (socket.exitHandler) {
      await collection.exit(socket.exitHandler.roomID, socket.exitHandler);
      let roomsDetails = await collection.allRooms();
      chat.emit('lobby', roomsDetails);
    }
    console.log(socket.id, 'disconnected');
  });

  socket.on('auth', async (username) => {
    let check = await collection.checkname(username);
    console.log(check);
    chat.to(socket.id).emit('auth', check);
  });

});