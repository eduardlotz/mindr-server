const { Rooms } = require("../database/models");
const createError = require("./createError");

const createRoom = async (room, user) => {
  return Rooms.create({ room, user });
};

module.exports = createRoom;
