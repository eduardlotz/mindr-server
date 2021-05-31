require("dotenv").config();

const http = require("http");

const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const compression = require("compression");
const cookieParser = require("cookie-parser");
var jwt = require("express-jwt");
const dbConnection = require("./database/dbConnection");
const router = require("./router");
const ioHandler = require("./io");
const { verifyToken } = require("./utils");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: [`${process.env.FRONT_URL}`, "http://localhost:3000"],
  },
});

app.use(cookieParser());
app.use(
  cors({
    credentials: false,
    origin: [`${process.env.FRONT_URL}`, "http://localhost:3000"],
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// RESTFUL API routes 
// User & Room management
app.use("/api", router);

// Socket.io handler
// real time actions like joining rooms, sending messages
io.on("connection", ioHandler(io));

module.exports = { server, app, dbConnection };
