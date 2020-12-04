'use strict';
const collection = require('../database/collection');

const { chat } = require('../server');

chat.on('connection', (socket) => {
  console.log(socket.id,'connected');

  socket.on('join', async (payload) => {
    socket.exitHandler = { name: payload.name, roomID: payload.roomID };
    const messages = await collection.join(payload.roomID, payload);
    if (messages) {
      console.log(socket.id,' joined room:', payload.roomID);
      socket.join(payload.roomID);
      chat.to(socket.id).emit('messages', messages);
    }
  });

  socket.on('exit', (payload) => {
    collection.exit(payload.roomID, payload);
    socket.leave(payload.roomID);
  });

  socket.on('sendMessage', (payload) => {
    collection.sendMessage(payload.roomID, payload);
    chat.to(payload.roomID).emit('newMessage', payload);
  });

  socket.on('createRoom', async (payload) => {
    const roomID = await collection.createRoom(payload.roomName);
    socket.exitHandler = { name: payload.name, roomID };
    await collection.join(roomID, payload);
    socket.join(roomID);
  });

  socket.on('disconnect', () => {
    if (socket.exitHandler) {
      collection.exit(socket.exitHandler.roomID, socket.exitHandler);
    }
    console.log(socket.id,'disconnected');
  });

});

