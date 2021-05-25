const { v4: uuidv4 } = require("uuid");

const { Users } = require("../database/models");

const createUser = async ({ name, avatar }) => {
  const uuid = uuidv4();
  console.log("user created, uuid: ", uuid);
  await Users.create({ name, avatar, uuid });
  return uuid;
};

module.exports = createUser;
