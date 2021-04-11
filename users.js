const users = [];

const addUser = (id, name, room, avatar) => {
  const existingUser = users.find(
    (user) => user.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  if (existingUser) return { error: "Username has already been taken" };
  if (!name && !room) return { error: "Username and room are required" };
  if (!name) return { error: "Username is required" };
  if (!room) return { error: "Room is required" };

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

module.exports = {
  addUser,
  deleteUser,
  getUser,
  getUsers,
};
