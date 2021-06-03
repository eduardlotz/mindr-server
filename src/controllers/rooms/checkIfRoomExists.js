const { isNewRoom, createError } = require("../../utils");
const Rooms = require("../../database/models/Rooms");

const checkIfRoomExists = async (req, res, next) => {
  try {
    const roomName = req.body.room;

    const roomInvalid = await isNewRoom(roomName);

    if (!roomInvalid) {
      const error = createError(400, "Bad Request", "This room doesn't exist.");
      throw error;
    }

    res.json({ statusCode: 200 });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = checkIfRoomExists;
