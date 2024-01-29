const { default: axiosIntance } = require("@/utils/axiosInstance");
const { useState } = require("react");

const useChat = () => {
  const [allChats, setAllChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const createRoom = (user1, user2) => {
    axiosIntance
      .post("/chat/create", { user1, user2 })
      .then((res) => {
        console.log("Successfully Created");
        getAllChats(user1);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllChats = (user) => {
    axiosIntance
      .get(`/chat/view-all/${user}`)
      .then((res) => setAllChats(res.data.data))
      .catch((err) => setAllChats([]));
  };
  const getChats = (roomId) => {
    axiosIntance
      .get(`/chat/view/${roomId}`)
      .then((res) => setChatMessages(res.data.data.messages))
      .catch((error) => {});
  };
  const sendMessage = (roomId, userId, message) => {
    axiosIntance
      .patch("/chat/edit", { roomId, userId, message })
      .then((res) => getChats(roomId));
  };
  return {
    createRoom,
    allChats,
    getAllChats,
    chatMessages,
    getChats,
    sendMessage,
  };
};

module.exports = useChat;
