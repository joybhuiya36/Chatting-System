const ChatRoomModel = require("../../model/chatRoomModel/chatRoomModel");

class ChatRoomService {
  static async isChatRoomExistbyUser(user1, user2) {
    const room = await ChatRoomModel.findOne({
      users: { $all: [user1, user2] },
    });
    if (room) return true;
    return false;
  }
  static async isChatRoomExistbyRoomId(roomId) {
    const room = await ChatRoomModel.findOne({ roomId });
    if (room) return true;
    return false;
  }
  static async findChatbyUser(user1, user2) {
    return await ChatRoomModel.findOne({ users: { $all: [user1, user2] } });
  }
  static async findChatbyRoomId(roomId) {
    return await ChatRoomModel.findOne({ roomId })
      .populate("messages.user")
      .populate("users");
  }
  static async findAllChats(user) {
    return await ChatRoomModel.find({ users: { $in: [user] } }).populate(
      "users"
    );
  }
  static async createRoom(user1, user2, roomId) {
    if (await this.isChatRoomExistbyUser(user1, user2))
      return {
        success: false,
        error: "Chat Room is Already Created",
      };
    const chatRoom = await ChatRoomModel.create({
      users: [user1, user2],
      roomId: roomId,
      messages: [],
    });
    if (chatRoom) return { success: true, data: chatRoom };
    return { success: false, error: "Failed to Create Chat Room" };
  }
  static async findChat(roomId) {
    const chat = await this.findChatbyRoomId(roomId);

    if (!chat)
      return {
        success: false,
        error: "Chat Room isn't Found",
      };
    return { success: true, data: chat };
  }
  static async addMessages(roomId, userId, message) {
    const chat = await this.findChatbyRoomId(roomId);
    if (!chat) return { success: false, error: "Chat Room isn't Found" };
    chat.messages.push({ user: userId, content: message });
    await chat.save();
    return {
      success: true,
      data: chat,
    };
  }
}

module.exports = ChatRoomService;
