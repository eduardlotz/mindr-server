const { isNewRoom } = require("../../utils");
const Rooms = require("../../database/models/Rooms");
const { v4: uuidv4 } = require("uuid");

const addRoom = async (req, res, next) => {
  try {
    let roomName = "";
    do {
      roomName = Math.random().toString(36).substr(2, 4).toUpperCase();
    } while (!isNewRoom(roomName));

    const user = { name: req.body.name, avatar: req.body.avatar };

    console.log("user who created room:", user);
    console.log("room name", roomName);

    // await validateSignUpData({ name, avatar });

    const room = new Rooms({ name: roomName });

    const uuid = uuidv4();

    room.users = [
      {
        name: user.name,
        avatar: user.avatar,
        isCreator: true,
        uuid: uuid,
      },
    ];

    const roomCreated = await room.save();
    console.log("roomCreated", roomCreated);

    res.json({ statusCode: 200, data: roomName });
  } catch (err) {
    console.error("failed to create a new room");
    next(err);
  }
};

module.exports = addRoom;
