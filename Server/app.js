const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const socketController = require("./socket/socketController");
const databaseConnection = require("./config/database");
const ChatRoomRoutes = require("./routes/chatRoomRoutes");

dotenv.config();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});
io.on("connection", socketController);

app.use("/chat", ChatRoomRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ message: "Invaild JSON Format" });
  } else {
    next(err);
  }
});
app.use((req, res) => {
  return res.status(400).send({ message: "Bad Request" });
});

databaseConnection(() => {
  server.listen(PORT, () => {
    console.log(`Server is Running on ${PORT} Port`);
  });
});
