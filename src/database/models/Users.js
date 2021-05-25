const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
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
  role: {
    type: String,
    required: false,
  },
});

const Users = model("Users", userSchema);

module.exports = Users;
