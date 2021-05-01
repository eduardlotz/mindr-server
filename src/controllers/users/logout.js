const logout = (req, res, next) => {
  try {
    res.clearCookie('mindrToken').sendStatus(200);
  } catch (err) {
    next(err);
  }
};

module.exports = logout;
