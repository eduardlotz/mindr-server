const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { createUser, deleteUser, getUser } = require("./users");
const {
  createRoomAndJoin,
  getUsersInRoom,
  joinRoom,
  leaveRoom,
  findRoom,
} = require("./rooms");

app.use(cors());

// generates a random 4 characters string
const generateRoomId = () =>
  Math.random().toString(36).substr(2, 4).toUpperCase();

io.on("connect", (socket) => {
  socket.on("join", ({ name, room, avatar }, callback) => {
    console.log(`${name} is trying to join ${room}`);

    const { errors: userErrors, user } = createUser(socket.id, name, avatar);

    if (userErrors) {
      console.log(userErrors);
      return callback(userErrors);
    }

    const { room: foundRoom, errors: joinErrors } = joinRoom(room, user);

    if (joinErrors) {
      console.log(joinErrors);
      return callback(joinErrors);
    }

    // join room and emit new user list to room
    socket.join(room);
    io.in(room).emit("users", getUsersInRoom(room));

    //emit current settings to joined user
    const settings = {
      games: foundRoom.games,
      isStandardMode: foundRoom.isStandardMode,
      maxRounds: foundRoom.maxRounds,
    };
    io.to(user.id).emit("game_settings", settings);

    callback();
  });

  socket.on("create_room", ({ name, avatar }, callback) => {
    let room;

    do {
      room = generateRoomId();
    } while (io.sockets.adapter.rooms[room]);

    const { errors, user } = createUser(socket.id, name, avatar);

    if (errors) {
      console.log(errors);
      return callback(errors);
    }

    console.log("new user created");
    console.log(user);

    const { errors: roomErrors } = createRoomAndJoin(room, user);

    if (roomErrors) {
      console.log(roomErrors);
      return callback(roomErrors);
    }

    socket.join(room);

    // emit new room id to client
    io.to(socket.id).emit("joined_room", room);

    io.in(room).emit("users", getUsersInRoom(room));

    callback();
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    deleteUser(socket.id);

    const { errors, roomId } = leaveRoom(socket.id);

    console.log("roomId", roomId);

    if (errors) {
      console.log(errors);
    } else {
      io.in(roomId).emit("users", getUsersInRoom(roomId));
    }
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
