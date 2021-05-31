const { clientError, serverError } = require("./errorHandlers");
const { authenticate, addUser, checkToken, logout } = require("./users");
const { getRooms, addRoom, joinRoom } = require("./rooms");

module.exports = {
  clientError,
  serverError,
  authenticate,
  addUser,
  checkToken,
  logout,
  getRooms,
  addRoom,
  joinRoom,
};
