'use strict';

const mongoose = require('mongoose');

const username = mongoose.model('username',
  mongoose.Schema({
    name: { type: String, required: true },
  }),
);

module.exports = username;
