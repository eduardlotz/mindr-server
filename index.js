const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { addUser, deleteUser, getUsers } = require("./users");

app.use(cors());

// generates a random 4 characters string
const generateRoomId = () =>
  Math.random().toString(36).substr(2, 4).toUpperCase();

io.on("connect", (socket) => {
  socket.on("join", ({ name, room, avatar }, callback) => {
    const { user, error } = addUser(socket.id, name, room, avatar, true);

    if (error) {
      console.log(error);
      return callback(error);
    }

    socket.join(user.room);

    io.in(room).emit("users", getUsers(room));
    callback();
  });

  socket.on("create_room", ({ name, avatar }, callback) => {
    let room;

    do {
      room = generateRoomId();
    } while (io.sockets.adapter.rooms[room]);

    const { error, user } = addUser(socket.id, name, room, avatar, false);

    if (error) {
      console.log(error);
      return callback(error);
    }

    socket.join(user.room);

    io.in(room).emit("users", getUsers(room));

    io.in(room).emit("room", room);

    callback();
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    const user = deleteUser(socket.id);
    if (user) {
      io.in(user.room).emit("users", getUsers(user.room));
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

/*  Example sockets from github

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

*/
