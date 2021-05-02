const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  role: String,
});

const Users = model("Users", userSchema);

module.exports = Users;
