const { verifyToken, createError } = require("../utils");

const withAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    console.log(token);
    const userData = await verifyToken(token);
    console.log(userData);
    req.userData = userData;
    return next();
  } catch (err) {
    if (err.message === "jwt must be provided") {
      const errResponse = createError(
        403,
        "Forbidden",
        "you need to login first to access this resource"
      );
      return res.status(403).json(errResponse);
    }
    return next(err);
  }
};

module.exports = withAuth;

const getTokenFromRequest = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};
