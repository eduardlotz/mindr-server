const { Rooms, Users } = require("../database/models");

const findRoomUsers = async (room) => {
  const roomInfo = await Rooms.findOne({ room });
  const roomUsers = await Users.find({ _id: { $in: roomInfo.users } });
  const usersInfo = roomUsers.map(({ username, avatar }) => {
    name: username, avatar;
  });
  return usersInfo;
};

module.exports = findRoomUsers;
