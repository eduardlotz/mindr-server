const { Schema, model } = require("mongoose");
const userSchema = require("./Users");
const gameSchema = require("./Games");

const roomSchema = new Schema({
  name: {
    type: String,
  },
  users: [userSchema],
  games: [gameSchema],
  maxRounds: {
    type: Number,
    default: 10,
  },
  currentRound: {
    type: Number,
    default: -1,
  },
});

const Rooms = model("Rooms", roomSchema);

module.exports = Rooms;
