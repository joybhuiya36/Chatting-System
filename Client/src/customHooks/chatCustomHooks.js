const { default: axiosIntance } = require("@/utils/axiosInstance");
const { useState } = require("react");

const useChat = () => {
  const [allChats, setAllChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userSearchResult, setUserSearchResult] = useState([]);

  const createRoom = (user1, user2) => {
    axiosIntance
      .post("/chat/create", { user1, user2 })
      .then((res) => {
        console.log("Successfully Chatroom is Created");
        getChatsWithAll(user1);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getChatsWithAll = (user) => {
    axiosIntance
      .get(`/chat/view-all/${user}`)
      .then((res) => setAllChats(res.data.data))
      .catch((err) => setAllChats([]));
  };
  const getOneChat = (roomId) => {
    axiosIntance
      .get(`/chat/view/${roomId}`)
      .then((res) => {
        setChatMessages(res.data.data.messages);
      })
      .catch((error) => {});
  };
  const sendMessage = (roomId, userId, message) => {
    axiosIntance.patch("/chat/edit", { roomId, userId, message });
  };
  const searchUsers = (user) => {
    if (user.length == 0) {
      setUserSearchResult([]);
      return;
    }
    axiosIntance
      .get(`/user/search/${user}`)
      .then((res) => setUserSearchResult(res.data.data));
  };
  return {
    createRoom,
    allChats,
    getChatsWithAll,
    chatMessages,
    getOneChat,
    sendMessage,
    searchUsers,
    userSearchResult,
  };
};

module.exports = useChat;
