const express = require("express");
const { spawn } = require("child_process");
var cors = require("cors");
const fs = require("fs");
const fetch = require("node-fetch");

const http = require("http");
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = 3001;

app.use(cors());

app.get("/api/calculate", async (req, res) => {
  const result = await (
    await fetch("http://localhost:8000" + req.originalUrl)
  ).json();

  console.log(result);

  res.send(result);
});

app.get("/api/generate", (req, res) => {
  fs.readFile("nounlist.txt", "utf-8", function (err, data) {
    if (err) {
      throw err;
    }
    var lines = data.split("\n");

    var line = lines[Math.floor(Math.random() * lines.length)].trim();

    res.send({ word: line });
  });
});

const playersInRoom = {};

io.on("connection", (socket) => {
  let player = "";
  let room = "";

  socket.on("joinRoom", ({ playerName, roomCode }) => {
    roomCode = roomCode.toString;
    socket.join(roomCode);
    console.log(`${playerName} has joined room ${roomCode}`);

    player = playerName;
    room = roomCode;

    console.log(playersInRoom[roomCode] || []);

    playersInRoom[roomCode] = [...(playersInRoom[roomCode] || []), playerName];

    io.to(roomCode).emit("joinRoom", playersInRoom[roomCode]);
  });

  socket.on("disconnect", () => {
    console.log(`${player} has disconnected from room ${room}`);
    console.log(playersInRoom, room);
    io.to(room).emit(
      "joinRoom",
      playersInRoom[room]?.filter((x) => x !== player)
    );
  });
});

server.listen(port, () =>
  console.log(`Example app listening on port 
${port}!`)
);
