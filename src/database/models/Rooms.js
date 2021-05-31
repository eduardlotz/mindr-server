const { Schema, model } = require("mongoose");
const usersSchema = require("./Users");

const roomSchema = new Schema({
  name: {
    type: String,
  },
  users: [usersSchema],
});

const Rooms = model("Rooms", roomSchema);

module.exports = Rooms;
