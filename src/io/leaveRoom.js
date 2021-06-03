const { Rooms } = require("../database/models");
const createError = require("../utils/createError");

const leaveRoom =
  (io, socket) =>
  async ({ roomName }, callback) => {
    try {
      const id = socket.id;
      console.log("leaving id", id);
      console.log("leaving room", roomName);

      const room = await Rooms.findOne({ name: roomName });

      // message has to match an i18n translation string
      if (!room) {
        const error = createError(400, "Bad Request", "roomInvalid");

        callback(error);
        throw error;
      }

      const disconnectingUser = room.users.find((user) => user.uuid === id);

      //set the next player as the creator, if leaving user was the creator
      if (disconnectingUser.isCreator) room.users[0].isCreator = true;
      room.users = room.users.filter((user) => {
        user !== disconnectingUser;
      });

      const roomAfterLeaving = await room.save();
      socket.leave(room.name);

      //if no users left in the room, delete the room
      //else inform others in room about the left user
      if (roomAfterLeaving.users.length === 0)
        Rooms.deleteOne({ name: roomName }, function (err) {
          if (err) console.log(err);
        });
      else io.to(room.name).emit("roomData", roomAfterLeaving);

      callback({ statusCode: 200 });
    } catch (err) {
      callback({ statusCode: 400 });
      console.error(err);
    }
  };

module.exports = leaveRoom;
