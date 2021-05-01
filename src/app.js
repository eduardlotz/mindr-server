require("dotenv").config();

const http = require("http");
const { join } = require("path");

const express = require("express");
const socketIO = require("socket.io");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const dbConnection = require("./database/dbConnection");
const router = require("./router");
const ioHandler = require("./io");
const { verifyToken } = require("./utils");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.disabled("x-powered-by");

app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", router);

io.use(async (socket, next) => {
  const token = socket.request.headers.cookie.match(
    /(?<=mindrToken=)(.*?)(?=;)/
  )[0];

  try {
    const decoded = await verifyToken(token);
    // eslint-disable-next-line no-param-reassign
    socket.decoded = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}).on("connection", ioHandler(io));

module.exports = { server, app, dbConnection };
