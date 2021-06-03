const Rooms = require("../../database/models/Rooms");
const { v4: uuidv4 } = require("uuid");
const createError = require("../../utils/createError");

const joinRoom = async (req, res, next) => {
  try {
    const user = { name: req.body.name, avatar: req.body.avatar };
    const roomName = req.body.room;

    console.log("user who joins:", user);
    console.log("room to join", roomName);

    // await validateSignUpData({ name, avatar });

    const room = await Rooms.findOne({ name: roomName });

    const uuid = uuidv4();

    if (!room)
      throw createError(400, "Bad Request", "roomInvalid");

    room.users.push({
      name: user.name,
      avatar: user.avatar,
      isCreator: false,
      uuid: uuid,
    });

    const roomAfterJoining = await room.save();
    console.log("roomAfterJoining", roomAfterJoining);

    io.to(room.name).emit("roomData", roomAfterJoining);

    res.json({ statusCode: 200, data: roomName });
  } catch (err) {
    console.error("room does not exist.");
    next(err);
  }
};

module.exports = joinRoom;
