const users = [];

const addUser = (id, name, room, avatar, joinRoom) => {
  const existingUser = users.find(
    (user) => user.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  if (existingUser) return { error: "username-taken" };
  if (!name && !room) return { error: "user-room-required" };
  if (!name) return { error: "user-required" };
  if (!room) return { error: "room-required" };
  if (joinRoom) if (!isRoomValid(room)) return { error: "room-invalid" };

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

module.exports = {
  addUser,
  deleteUser,
  getUser,
  getUsers,
};
