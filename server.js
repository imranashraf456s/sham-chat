const express = require("express");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 8080;
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));

server.listen(port, () => {
  console.log(`Server Active at port: ${port}`);
});

const rooms = { music: 0, movies: 0, games: 0, books: 0 };

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomName) => {
    let roomCount = rooms[roomName];
    if (rooms[roomName] >= 0) {
      console.log("Room Joined: " + roomName);
      socket.join(roomName);
      roomCount++;
      rooms[roomName] = roomCount;
      io.to(roomName).emit("population", roomCount);
    } else {
      socket.emit("noRoom");
    }
  });

  socket.on("sendMessage", (msg, roomName) => {
    socket.broadcast.to(roomName).emit("receiveMessage", msg);
  });

  socket.on("disconnecting", () => {
    const roomDetails = [...socket.rooms];

    if (roomDetails.length == 2) {
      console.log("socket in a room");
      let roomName = roomDetails[1];
      let roomCount = rooms[roomName];
      roomCount--;
      rooms[roomName] = roomCount;
      socket.leave(roomName);
      io.to(roomName).emit("population", roomCount);
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
