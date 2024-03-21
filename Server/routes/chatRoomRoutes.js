const express = require("express");
const ChatRoomController = require("../controller/chatRoomController");
const route = express();

route.get("/view/:roomId", ChatRoomController.viewChat);
route.get("/view-all/:user", ChatRoomController.viewAllChats);
route.post("/create", ChatRoomController.createRoom);
route.patch("/edit", ChatRoomController.addMessageToChat);

module.exports = route;
