const {
  validateSignUpData,
  createUser,
  getUserByUid,
  createToken,
} = require("../../utils");

const authenticate = async (req, res, next) => {
  console.log("authenticating a new user");
  const { username, avatar } = req.body;
  console.log("username", username);
  try {
    await validateSignUpData({ username, avatar });
    const uuid = await createUser({ username, avatar });
    const user = await getUserByUid(uuid);

    console.log(user);

    const token = await createToken(uuid);

    res.cookie("token", token).status(200).json({
      statusCode: 200,
      message: "user authenticated and token created",
      token,
    });
  } catch (err) {
    console.log("couldn't create token cookie");
    console.log(err);
    next(err);
  }
};

module.exports = authenticate;
