const socketController = (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log("join room", data);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log("send_message", data);
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
};

module.exports = socketController;
