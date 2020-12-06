'use strict';

const mongoose = require('mongoose');

const room = mongoose.model('room',
  mongoose.Schema({
    islocked: { type: Boolean, default: false },
    name: { type: String, required: true },
    password: { type: String, default: '' },
    messages: { type: [], default:[] },
    pepole: { type: [], default:[] },
    date: { type: Date, default: Date.now },
  }),
);

module.exports = room;
