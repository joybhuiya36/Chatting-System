const { default: axiosIntance } = require("@/utils/axiosInstance");
const { useState } = require("react");

const useChat = () => {
  const [allChats, setAllChats] = useState([]);

  const getAllChats = (user) => {
    axiosIntance
      .get(`/chat/view-all/${user}`)
      .then((res) => setAllChats(res.data.data))
      .catch((err) => setAllChats([]));
  };
  return { allChats, getAllChats };
};

module.exports = useChat;
