const rooms = [];

const createRoomAndJoin = (id, user) => {
  let errors = [];

  //check if user already in another room
  const foundUser = findUser(user.id);
  if (foundUser) {
    errors.push({
      message: "alreadyInRoom",
      type: "toast",
    });

    return { errors };
  }

  // room object
  let room = {
    id: id,
    members: [user],
    creator: user.id,
    games: [0], // first game is always active on init
    currentGame: {},
    currentRound: 0,
    maxRounds: 0,
    isStandardMode: true,
    isRunning: false,
  };

  rooms.push(room);

  user.room = room.id;


  return { room };
};

const joinRoom = (id, user) => {
  let errors = [];

  //check if user already in another room
  const foundUser = findUser(user.id);

  const room = findRoom(id);

  if (foundUser) {
    errors.push({
      message: "already in a room",
      type: "toast",
    });
  }

  //check if payload includes a room
  if (!id)
    errors.push({
      message: "roomRequired",
      type: "room",
    });

  if (!room) errors.push({ message: "roomInvalid", type: "room" });

  if (room && room.members.length === 10) {
    errors.push({
      message: "room is full",
      type: "toast",
    });
  }

  if (errors.length > 0) return { errors };

  room.members.push(user);

  user.room = room.id;

  return { room };
};

const leaveRoom = (userId) => {
  let errors = [];
  // search for a user with this userId and get his roomId
  // remove the user from the room and return the new user list
  for (let i = 0; i < rooms.length; i++) {
    const user = rooms[i].members.find((user) => user.id === userId);
    if (user) {
      const room = rooms[i];

      room.members = room.members.filter((user) => {
        return user.id !== userId;
      });

      const roomId = room.id;

      return { roomId };
    }
  }

  errors.push({ message: "failedLeaving", type: "console" });
  return { errors };
};

const getUsersInRoom = (id) => {
  const members = rooms.find((room) => room.id === id).members;
  return members;
};

const findUser = (id) => {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i]) rooms[i].members.find((user) => user.id === id);
  }
};

const findRoom = (id) => rooms.find((room) => room.id === id);

module.exports = {
  createRoomAndJoin,
  getUsersInRoom,
  joinRoom,
  leaveRoom,
  findRoom,
};
