// only used for testing
const { Users } = require('../database/models');

const createAdmin = async ({ username, avatar }) => {
  await Users.create({
    username,
    avatar,
    role: 'admin',
  });
};

module.exports = createAdmin;
