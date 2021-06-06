const { Rooms } = require("../database/models");
const { createError } = require("../utils");

const socketDisconnect = (io, socket) => async () => {
  try {
    const _id = socket.id;
    const room = await Rooms.findOne({ "users.uuid": _id });

    if (!room) throw createError(400, "Bad Request", "roomInvalid");

    console.log("room where user gets kicked", room);

    room.users = room.users.filter((user) => {
      return user.uuid !== _id;
    });

    const roomAfterDisconnecting = await room.save();
    socket.leave(room.name);

    //if no users left in the room, delete the room
    if (roomAfterDisconnecting.users.length === 0)
      Rooms.deleteOne({ _id: room._id }, function (err) {
        if (err) console.log(err);
      });
    else io.to(room.name).emit("roomData", roomAfterDisconnecting);
  } catch (err) {
    console.log(err);
  }
};

module.exports = socketDisconnect;
