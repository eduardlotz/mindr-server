const { Rooms, Users } = require("../database/models");

const findRoomUsers = async (roomName) => {
  const room = await Rooms.findOne({ name: roomName });
  return room.users;
};

module.exports = findRoomUsers;
