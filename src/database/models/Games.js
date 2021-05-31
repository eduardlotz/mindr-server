const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
  name: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});

const Games = model("Games", gameSchema);

module.exports = Games;
