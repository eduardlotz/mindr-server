const { Rooms } = require("../database/models");
const createError = require("../utils/createError");

const removeUser =
  (io, socket) =>
  async ({ id, room: roomName }, callback) => {
    try {
      const clientId = socket.id;
      console.log("client id", clientId);

      const room = await Rooms.findOne({ name: roomName });

      // message has to match an i18n translation string
      if (!room) {
        const error = createError(400, "Bad Request", "roomInvalid");
        callback(error);
        throw error;
      }

      console.log("room where user gets kicked", room);

      const sender = room.users.find((user) => user.uuid === clientId);
      const disconnectingUser = room.users.find((user) => user.uuid === id);

      if (!sender) throw createError(400, "Bad Request", "invalidSender");
      if (!sender.isCreator)
        throw createError(401, "Authentication Failed", "authFailed");
      if (disconnectingUser.uuid === sender.uuid)
        throw createError(400, "Bad Request", "kickCreator");

      room.users = room.users.filter((user) => {
        return user.uuid !== disconnectingUser.uuid;
      });

      const roomAfterKicking = await room.save();
      socket.leave(room.name);

      console.log("roomAfterKicking", roomAfterKicking);

      //if no users left in the room, delete the room
      //else inform others in room about the left user
      if (roomAfterKicking.users.length === 0)
        Rooms.deleteOne({ name: roomName }, function (err) {
          if (err) console.log(err);
        });
      else io.to(room.name).emit("roomData", roomAfterKicking);
    } catch (err) {
      callback({ statusCode: 400 });
      console.error(err);
    }
  };

module.exports = removeUser;
