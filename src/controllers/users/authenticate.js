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

    const token = await createToken(user._id, user.role);

    res
      .cookie("mindrToken", token)
      .status(201)
      .json({
        statusCode: 201,
        message: "user authenticated and token created",
      });
  } catch (err) {
    console.error("couldn't create token cookie");
    next(err);
  }
};

module.exports = authenticate;
