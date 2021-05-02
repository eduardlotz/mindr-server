const { Users } = require("../database/models");
const createError = require("./createError");

const getUserByUid = async (uuid) => {
  const user = await Users.findOne({ uuid });

  if (!user)
    throw createError(
      400,
      "Bad Request",
      "an account with this uuid does not exist"
    );

  return user;
};

module.exports = getUserByUid;
