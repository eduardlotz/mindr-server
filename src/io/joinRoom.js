const { Rooms } = require("../database/models");
const createError = require("../utils/createError");

const joinRoom =
  (io, socket) =>
  async ({ name, avatar, roomName }, callback) => {
    try {
      const id = socket.id;

      console.log(id + " is joining room " + roomName);

      const user = { name, avatar };

      const room = await Rooms.findOne({ name: roomName });

      if (!room) {
        const error = createError(
          400,
          "Bad Request",
          "This room doesn't exist."
        );

        callback(error);
        throw error;
      }

      room.users.push({
        name: user.name,
        avatar: user.avatar,
        isCreator: false,
        uuid: id.toString(),
      });

      const roomJoined = await room.save();
      console.log("roomJoined", roomJoined);

      socket.join(roomName);

      io.to(room.name).emit("joinRoom", roomJoined);
    } catch (err) {
      console.error(err);
      // callback(err);
    }
  };

module.exports = joinRoom;
