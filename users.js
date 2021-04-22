let users = [];

const createUser = (id, name, avatar) => {
  let errors = [];

  // return errors if no name or no avatar
  if (!name) {
    errors.push({ message: "usernameRequired", type: "username" });
  }
  if (!avatar) {
    errors.push({ message: "avatarRequired", type: "avatar" });
  }

  if (errors.length > 0) return { errors };

  // user object
  const user = {
    id: id,
    name: name,
    avatar: avatar,
    points: 0,
    sips: 0,
    room: "",
    isCreator: false,
  };

  users.push(user);

  return { user };
};

const deleteUser = (id) => {
  users = users.filter((user) => {
    user.id !== id;
  });
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

module.exports = {
  createUser,
  deleteUser,
  getUser,
};
