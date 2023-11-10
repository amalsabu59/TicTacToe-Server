const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const {
  router: gameRoutes,
  updateCurrentGame,
  getOUserIdByRoomNo,
} = require("./routes/game");
const checkWin = require("./helpers");
// const updateCurrentGame = require("./routes/game");

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/game", gameRoutes);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://tic-tac-toe-client-tau.vercel.app",
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected Successfully !");
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_moves", async (data) => {
    const winner = checkWin(data.newData);
    // console.log(winner);
    updateCurrentGame(data.room, data.newData, data.userIdForNextMove);
    socket.to(data.room).emit("receive_moves", {
      data,
      userIdForNextMove: data.userIdForNextMove
        ? data.userIdForNextMove
        : await getOUserIdByRoomNo(data.room),
      winner: winner ? winner : null,
    });
  });
  socket.on("wins", (data) => {
    // console.log(data);
    socket.to(data.room).emit("winner", {
      winner: data.winner,
    });
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
