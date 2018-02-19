'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqid = require('uniqid');

const ImageSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  addedByUser: {
    type: String,
    required: true
  },
  likes: [String]
});

// auto generate the id
ImageSchema.pre('validate', function(next) {
  if (!this.id) {
    this.id = uniqid();
  }
  next();
})

module.exports = mongoose.model('Image', ImageSchema);