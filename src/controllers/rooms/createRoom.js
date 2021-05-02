const { isNewRoom, createRoom } = require("../../utils");

const addRoom = async (req, res, next) => {
  try {
    let room = "";
    do {
      room = Math.random().toString(36).substr(2, 4).toUpperCase();
    } while (!isNewRoom(room));

    await createRoom(room);

    res.json({ statusCode: 200, data: room });
  } catch (err) {
    next(err);
  }
};

module.exports = addRoom;
