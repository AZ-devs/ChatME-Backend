'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

const server = require('./src/server');

mongoose.connect(MONGODB_URI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  server.start(PORT);
}).catch((err) => {
  console.error(err.message);
});