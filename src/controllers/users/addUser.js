const { validateSignUpData, createUser, getUserByUid } = require("../../utils");

const addUser = async (req, res, next) => {
  const { name, avatar } = req.body;
  
  // await validateSignUpData({ name, avatar });

  const uuid = await createUser({ name, avatar });
  const user = await getUserByUid(uuid);
};

module.exports = addUser;
