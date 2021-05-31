const { Schema, model } = require("mongoose");

const usersSchema = new Schema({
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  uuid: {
    type: String,
  },
  isCreator: {
    type: Boolean,
    default: false,
  },
  points: {
    type: Number,
    default: 0,
  },
});

module.exports = usersSchema;
