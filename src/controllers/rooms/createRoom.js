const { isNewRoom, createRoom } = require("../../utils");

const addRoom = async (req, res, next) => {
  try {
    let room = "";
    do {
      room = Math.random().toString(36).substr(2, 4).toUpperCase();
    } while (!isNewRoom(room));

    const user = await getUserByUid(req.body.uuid);

    await createRoom(room, user);

    console.log("room created", room);

    res.json({ statusCode: 200, data: room });
  } catch (err) {
    console.error("failed to create a new room");
    next(err);
  }
};

module.exports = addRoom;
