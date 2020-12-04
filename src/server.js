'use strict';

const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());


const io = socketio(server);
const chat = io.of('/chat');
chat.on('connection', (socket) => {
  require('./socket.io/chat');
});


module.exports = {
  server: app,
  start: (port) => {
    server.listen(port, () => {
      console.log(`up and running on ${port}`);
    });
  },
  chat,
};