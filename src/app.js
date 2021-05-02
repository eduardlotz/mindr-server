require("dotenv").config();

const http = require("http");

const express = require("express");
const cors = require("cors");
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

app.use(cookieParser());
app.use(
  cors({
    origin: [`${process.env.FRONT_URL}`, "http://localhost:3000"],
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

io.use(async (socket, next) => {
  try {
    const token = socket.request.headers.cookie.match(
      /(?<=mindrToken=)(.*?)(?=;)/
    )[0];

    const decoded = await verifyToken(token);
    // eslint-disable-next-line no-param-reassign
    socket.decoded = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}).on("connection", ioHandler(io));

module.exports = { server, app, dbConnection };
