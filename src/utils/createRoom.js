const { Rooms } = require("../database/models");
const createError = require("./createError");

const createRoom = async (room) => {
  return Rooms.create({ room });
};

module.exports = createRoom;
