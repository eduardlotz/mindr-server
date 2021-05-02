const { v4: uuidv4 } = require("uuid");

const { Users } = require("../database/models");

const createUser = async ({ username, avatar }) => {
  const uuid = uuidv4();
  console.log("uuid", uuid);
  await Users.create({ username, avatar, uuid });
  return uuid;
};

module.exports = createUser;
