const { Rooms, Chats } = require("../database/models");
const { findRoomUsers } = require("../utils");
const { isNewRoom } = require("../utils");

const createRoom =
  (io, socket) =>
  async ({ name, avatar }, callback) => {
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

      const newRoom = await room.save();
      console.log("newRoom:", newRoom);
      socket.join(roomName);

      callback(newRoom);
    } catch (err) {
      console.log(err);
      callback(err);
    }
  };

module.exports = createRoom;
