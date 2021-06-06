const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageClass: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
});

module.exports = gameSchema;
