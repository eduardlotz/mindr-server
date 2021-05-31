const signToken = require('./signToken');

const createToken = async (userId) => {
  const payload = {};
  payload._id = userId;

  payload.role = 'creator';

  return signToken(payload);
};

module.exports = createToken;
