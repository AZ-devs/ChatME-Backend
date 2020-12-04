'use strict';
const collection = require('../database/collection');

const { chat } = require('../server');

chat.on('connection', (socket) => {
  console.log('connection');

  socket.on('join', (roomID, payload) => {
    socket.exitHandler = { name: payload.name, roomID };
    socket.join(roomID);
    collection.join(roomID, payload);
  });

  socket.on('exit', (roomID, payload) => {
    collection.exit(roomID, payload);
    socket.leave(roomID);
  });

  socket.on('disconnect', () => {
    collection.exit(socket.exitHandler.roomID, socket.exitHandler);
  });

});

