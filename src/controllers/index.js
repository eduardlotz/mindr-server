const { clientError, serverError } = require("./errorHandlers");
const { authenticate, login, checkToken, logout } = require("./users");
const { getRooms, addRoom } = require("./rooms");

module.exports = {
  clientError,
  serverError,
  authenticate,
  login,
  checkToken,
  logout,
  getRooms,
  addRoom,
};
