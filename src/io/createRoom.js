const { Rooms, Chats } = require("../database/models");
const { findRoomUsers } = require("../utils");
const { isNewRoom } = require("../utils");

const joinRoom =
  (io, socket) =>
  async ({ name, avatar }) => {
    try {
      const id = socket.id;

      let roomName = "";
      do {
        roomName = Math.random().toString(36).substr(2, 4).toUpperCase();
      } while (!isNewRoom(roomName));

      const user = { name, avatar };

      console.log("user who created room:", user);
      console.log("room name", roomName);

      const room = new Rooms({ name: roomName });

      room.users = [
        {
          name: user.name,
          avatar: user.avatar,
          isCreator: true,
          uuid: id,
        },
      ];

      const roomCreated = await room.save();
      console.log("roomCreated", roomCreated);
      socket.join(roomName);

      io.to(room.name).emit("createRoom", roomCreated);
    } catch (err) {
      console.log(err);
    }
  };

module.exports = joinRoom;
