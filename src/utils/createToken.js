const signToken = require('./signToken');

const createToken = async (userId, userRole) => {
  const payload = {};
  payload._id = userId._id;

  payload.role = 'admin';

  return signToken(payload);
};

module.exports = createToken;
