'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const collection = require('./src/database/collection');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

const server = require('./src/server');

mongoose.connect(MONGODB_URI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  server.start(PORT);
  await collection.resetPeople();
}).catch((err) => {
  console.error(err.message);
});