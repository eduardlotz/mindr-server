const users = [];

const addUser = (id, name, room, avatar, joinRoom) => {
  let errors = [];

  if (joinRoom) {
    const existingUser = getUserInRoom(name, room);

    const validRoom = isRoomValid(room);

    if (existingUser) {
      console.log("username already taken");
      errors.push({ message: "usernameTaken", type: "username" });
    }

    if (!validRoom) {
      console.log("this room does not exist");

      errors.push({ message: "roomInvalid", type: "room" });
    }
  }

  if (!name && !room) {
    errors.push({ message: "avatarRequired", type: "avatar" });
  }
  if (!name) {
    errors.push({ message: "usernameRequired", type: "username" });
  }
  if (!room) {
    errors.push({ message: "roomRequired", type: "room" });
  }

  if (!avatar) {
    errors.push({ message: "avatarRequired", type: "avatar" });
  }

  if (errors.length > 0) return { errors };

  const user = { id, name, room, avatar };
  users.push(user);
  return { user };
};

const deleteUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsers = (room) => users.filter((user) => user.room === room);

const isRoomValid = (room) => users.find((user) => user.room === room);

const getUserInRoom = (name, room) =>
  users.find((user) => user.name === name && user.room === room);

module.exports = {
  addUser,
  deleteUser,
  getUser,
  getUsers,
};
