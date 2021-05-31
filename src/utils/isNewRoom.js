const { Rooms } = require("../database/models");
const createError = require("./createError");

const isNewRoom = async (roomName) => {
  return await Rooms.findOne({ name: roomName });
};

module.exports = isNewRoom;
