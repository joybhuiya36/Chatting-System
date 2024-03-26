const socketController = (socket) => {
  console.log("User Connected ", socket.id);
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("leave_room", (data) => {
    console.log("leave ", data);
    socket.leave(data);
  });
  socket.on("send_message", (data) => {
    socket.to(data.chatRoomId).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
};

module.exports = socketController;
