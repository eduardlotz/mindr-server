const { Rooms } = require("../database/models");
const { findRoomUsers } = require("../utils");

const joinRoom =
  (io, socket) =>
  async ({ name, avatar, roomName }) => {
    try {
      const id = socket.id;

      console.log(id + " is joining room " + roomName);

      const user = { name, avatar };

      console.log("user who joins:", user);
      console.log("room to join", roomName);

      const room = await Rooms.findOne({ name: roomName });

      if (!room)
        throw createError(400, "Bad Request", "this room does not exist");

      room.users.push({
        name: user.name,
        avatar: user.avatar,
        isCreator: false,
        uuid: id,
      });

      const roomJoined = await room.save();
      console.log("roomJoined", roomJoined);

      socket.join(roomName);

      // const roomMessages = await Chats.find({ room });

      io.to(room.name).emit("joinRoom", roomJoined);
    } catch (err) {
      console.log(err);
    }
  };

module.exports = joinRoom;
