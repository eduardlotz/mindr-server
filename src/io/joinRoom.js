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
        const error = createError(400, "Bad Request", "roomInvalid");

        callback(error);
        throw error;
      }

      room.users.push({
        name: user.name,
        avatar: user.avatar,
        isCreator: false,
        uuid: id.toString(),
      });

      const roomAfterJoining = await room.save();
      console.log("roomAfterJoining", roomAfterJoining);

      socket.join(room.name);

      io.to(room.name).emit("roomData", roomAfterJoining);
      callback(roomAfterJoining);
    } catch (err) {
      console.error(err);
    }
  };

module.exports = joinRoom;
