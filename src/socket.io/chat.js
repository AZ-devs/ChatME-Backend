'use strict';
const collection = require('../database/collection');

const { chat } = require('../server');

chat.on('connection', (socket) => {
  console.log('connection');

  socket.on('join', async (roomID, payload) => {
    socket.exitHandler = { name: payload.name, roomID };
    const messages = await collection.join(roomID, payload);
    if(messages){
      socket.join(roomID);
      chat.to(socket.id).emit('messages',messages);
    }
  });

  socket.on('exit', (roomID, payload) => {
    collection.exit(roomID, payload);
    socket.leave(roomID);
  });
  
  socket.on('sendMessage', (roomID,payload) => {
    collection.sendMessage(roomID,payload)
    chat.to(roomID).emit('newMessage',payload)
  });
  
  socket.on('disconnect', () => {
    collection.exit(socket.exitHandler.roomID, socket.exitHandler);
  });
  
});

