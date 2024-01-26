"use client";
import useChat from "@/customHooks/chatCustomHooks";
import axiosIntance from "@/utils/axiosInstance";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Chat = () => {
  const [recipient, setRecipient] = useState("");
  const { allChats, getAllChats } = useChat();
  const { param } = useParams();
  useEffect(() => {
    getAllChats(param);
  }, []);
  const handleCreateChat = () => {
    axiosIntance
      .post("/chat/create", { user1: param, user2: recipient })
      .then((res) => {
        console.log("Successfully Created");
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(allChats);
  return (
    <div>
      <input type="text" onChange={(e) => setRecipient(e.target.value)} />
      <button onClick={handleCreateChat}>Start Chat</button>
      {allChats?.map((chat) => (
        <div>
          {chat?.users?.map(
            (user) => user._id != param && <div>{user.name}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Chat;
