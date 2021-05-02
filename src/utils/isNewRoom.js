const { Rooms } = require("../database/models");
const createError = require("./createError");

const isNewRoom = async (room) => {
  const roomExist = await Rooms.findOne({ room });
  return roomExist ? true : false;
};

module.exports = isNewRoom;
