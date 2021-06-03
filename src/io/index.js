const joinRoom = require("./joinRoom");
const createRoom = require("./createRoom");
const leaveRoom = require("./leaveRoom");
const msgHandler = require("./msgHandler");
const socketDisconnect = require("./disconnect");

const ioHandler = (io) => (socket, callback) => {
  socket.on("joinRoom", joinRoom(io, socket, callback));
  socket.on("createRoom", createRoom(io, socket));
  socket.on("leaveRoom", leaveRoom(io, socket));
  socket.on("msg", msgHandler(io));

  socket.on("error", (err) => {
    console.log(err);
  });

  // socket.on("disconnecting", socketDisconnect(io, socket));
};

module.exports = ioHandler;
