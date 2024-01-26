const { isUserExist } = require("../../service/userService/userService");
const { success, failure } = require("../../utils/responeMessage");
const ChatRoomService = require("../../service/chatRoomService/chatRoomService");
const { default: mongoose } = require("mongoose");

class ChatRoomController {
  static async createRoom(req, res) {
    try {
      const { user1, user2 } = req.body;
      if (!isUserExist(user1) | !isUserExist(user2))
        return res.status(404).send(failure("User isn't Found"));
      const roomId = new mongoose.Types.ObjectId();
      const chatRoom = await ChatRoomService.createRoom(user1, user2, roomId);
      if (chatRoom.success)
        return res
          .status(201)
          .send(success("Chat Room is Created Successfully", chatRoom.data));
      return res.status(400).send(failure(chatRoom.error));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error"));
    }
  }
  static async viewAllChats(req, res) {
    try {
      const { user } = req.params;
      const chats = await ChatRoomService.findAllChats(user);
      return res
        .status(200)
        .send(success("All Chats are Fetched Successfully", chats.reverse()));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error"));
    }
  }
  static async viewChat(req, res) {
    try {
      const { roomId } = req.params;
      const chat = await ChatRoomService.findChat(roomId);
      if (!chat.success) return res.status(404).send(failure(chat.error));
      return res
        .status(200)
        .send(success("Chat is Fetched Successfully", chat.data));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error"));
    }
  }
  static async addMessageToChat(req, res) {
    try {
      const { roomId, userId, message } = req.body;
      if (!isUserExist(userId))
        return res.status(404).send(failure("User isn't Found"));
      const chat = await ChatRoomService.addMessages(roomId, userId, message);
      if (!chat.success) return res.status(400).send(failure(chat.error));
      return res
        .status(200)
        .send(success("Message is Added to Chat Successfully", chat.data));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error"));
    }
  }
}

module.exports = ChatRoomController;
