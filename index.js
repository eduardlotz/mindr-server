const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

const Message = require("./Message");
const mongoose = require("mongoose");
const ROOMS_LIMIT = 5;

const { createUser, deleteUser, getUser } = require("./users");
const {
  createRoomAndJoin,
  getUsersInRoom,
  joinRoom,
  leaveRoom,
  findRoom,
  roomLimitReached,
  getRoomsCount,
} = require("./rooms");

app.use(cors());

mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => console.log(err));

// generates a random 4 characters string
const generateRoomId = () =>
  Math.random().toString(36).substr(2, 4).toUpperCase();

io.on("connect", (socket) => {
  // Get the last 10 messages from the database.
  Message.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, messages) => {
      if (err) return console.error(err);

      // Send the last messages to the user.
      socket.emit("init_messages", messages);
    });

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

  // Listen to connected users for a new message.
  socket.on("message", (message) => {
    // Create a message with the content and the name of the user.
    const user = getUser(socket.id);

    const msg = new Message({
      content: message,
      user: user.name,
    });

    // Save the message to the database.
    msg.save((err) => {
      if (err) return console.error(err);
    });

    // Notify all other users about a new message.
    io.in(user.room).emit("new_message", msg);
  });

  socket.on("leave_room", () => {
    console.log(`${socket.id} left the room`);

    const { errors, roomId } = leaveRoom(socket.id);

    if (errors) {
      console.log(errors);
    } else {
      io.in(roomId).emit("users", getUsersInRoom(roomId));
    }
    socket.emit("left_room");
  });

  socket.on("pick_game", ({ id }, callback) => {
    const errors = [];

    const user = getUser(socket.id);

    const room = findRoom(user.room);

    if (!room) {
      errors.push({ message: "unexpected error oopsi", type: "toast" });
      console.log(errors);
      return callback(errors);
    }
    room.games.push(id);

    io.in(room.id).emit("pick_game", id);

    callback();
  });

  socket.on("remove_game", ({ id }, callback) => {
    const user = getUser(socket.id);

    const room = findRoom(user.room);

    if (!room) {
      return callback({ message: "error unpicking game", type: "toast" });
    }

    room.games = room.games.filter((game) => game !== id);

    io.in(room.id).emit("remove_game", id);

    callback();
  });

  socket.on("create_room", ({ name, avatar }, callback) => {
    if (roomLimitReached(ROOMS_LIMIT)) {
      let errors = [];

      errors.push({
        message: `rooms limit of ${ROOMS_LIMIT}reached. remove a room to create a new one.`,
        type: "toast",
      });
      console.log(errors);
      return callback(errors);
    }

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

    console.log("new rooms count: " + getRoomsCount());

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
