'use strict';
const collection = require('../database/collection');

const { chat } = require('../server');

chat.on('connection', (socket) => {
  console.log(socket.id, 'connected');

  socket.on('join', async (payload) => {// name , rommID , password
    socket.exitHandler = { name: payload.name, roomID: payload.roomID };
    const messages = await collection.join(payload.roomID, payload);
    if (messages) {
      console.log(socket.id, ' joined room:', payload.roomID);
      socket.join(payload.roomID);
      chat.to(socket.id).emit('messages', messages);
      let roomsDetails = await collection.allRooms();
      chat.emit('lobby', roomsDetails);
    }
  });

  socket.on('exit', async (payload) => {// rommID , name
    await collection.exit(payload.roomID, payload);
    socket.leave(payload.roomID);
    let roomsDetails = await collection.allRooms();
    chat.emit('lobby', roomsDetails);
  });

  socket.on('sendMessage', (payload) => {// roomID , name , avatar , text
    collection.sendMessage(payload.roomID, payload);
    chat.to(payload.roomID).emit('newMessage', payload);
  });

  socket.on('createRoom', async (payload) => {// name , roomName , password 
    const roomID = await collection.createRoom(payload);
    payload.roomID = roomID;
    socket.exitHandler = { name: payload.name, roomID: payload.roomID };
    await collection.join(payload);
    socket.join(payload.roomID);
    let roomsDetails = await collection.allRooms();
    chat.emit('lobby', roomsDetails);
  });

  socket.on('disconnect', async () => {
    if (socket.exitHandler) {
      await collection.exit(socket.exitHandler.roomID, socket.exitHandler);
      let roomsDetails = await collection.allRooms();
      chat.emit('lobby', roomsDetails);
    }
    console.log(socket.id, 'disconnected');
  });
});