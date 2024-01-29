"use client";
import useChat from "@/customHooks/chatCustomHooks";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";

const socket = io.connect(process.env.NEXT_PUBLIC_BACKEND_URL);

const Chat = () => {
  const [recipient, setRecipient] = useState("");
  const {
    createRoom,
    allChats,
    getAllChats,
    chatMessages,
    getChats,
    sendMessage,
  } = useChat();
  const [chatRoomId, setchatRoomId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [chats, setChats] = useState([]);
  const { param } = useParams();
  const chatContainerRef = useRef(null);
  useEffect(() => {
    getAllChats(param);
  }, []);
  useEffect(() => {
    setChats(chatMessages);
  }, [chatMessages]);
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chats]);
  useEffect(() => {
    socket.emit("join_room", chatRoomId);
  }, [chatRoomId]);
  useEffect(() => {
    let count = 0;
    socket.on("receive_message", (data) => {
      console.log("data", data);
      setChats((prevChats) => [
        ...prevChats,
        {
          user: { _id: recipient },
          content: data.inputMessage,
          timestamp: Date.now(),
        },
      ]);
    });
  }, [socket]);
  const ToBDTime = (time) => {
    const timestampString = time;
    const timestamp = new Date(timestampString);
    const options = {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    const bangladeshTime = new Intl.DateTimeFormat("en-US", options).format(
      timestamp
    );
    return bangladeshTime;
  };
  const handleChatRoom = (id) => {
    getChats(id);
    setchatRoomId(id);
  };
  const handleSendMessage = () => {
    socket.emit("send_message", { inputMessage, chatRoomId });
    setChats([
      ...chats,
      {
        user: { _id: param },
        content: inputMessage,
        timestamp: Date.now(),
      },
    ]);
    sendMessage(chatRoomId, param, inputMessage);
    setInputMessage("");
  };

  return (
    <div>
      <input type="text" onChange={(e) => setRecipient(e.target.value)} />
      <button
        onClick={() => {
          createRoom(param, recipient);
          setRecipient("");
        }}
      >
        Start Chat
      </button>
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            borderRight: "1px solid black",
            width: "30%",
          }}
        >
          {allChats?.map((chat) => (
            <div
              style={{ margin: "20px", cursor: "pointer" }}
              onClick={() => {
                handleChatRoom(chat?.roomId);
              }}
            >
              {chat?.users?.map(
                (user) =>
                  user?._id != param && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        alignItems: "center",
                        borderBottom: "1px solid grey",
                        paddingBottom: "8px",
                        width: "100%",
                      }}
                    >
                      <img
                        src={user?.image}
                        style={{
                          height: "50px",
                          width: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <span style={{ fontWeight: "700" }}>{user?.name}</span>
                    </div>
                  )
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            margin: "0 20px",
            width: "70%",
            height: "85vh",
            overflow: "auto",
          }}
          ref={chatContainerRef}
        >
          {chats?.map((chat) => (
            <div
              style={{
                display: "flex",
                gap: "8px",
                margin: " 3px 0",
                justifyContent:
                  param === chat?.user?._id ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "3px",
                }}
              >
                <span
                  style={{
                    width: "fit-content",
                    backgroundColor: "black",
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "10px",
                    alignSelf: param == chat?.user?._id ? "end" : "flex-start",
                  }}
                >
                  {chat?.content}
                </span>
                <span
                  style={{ display: "block", color: "gray", fontSize: "12px" }}
                >
                  {ToBDTime(chat?.timestamp)}
                </span>
              </div>
            </div>
          ))}
          <div
            style={{
              position: "fixed",
              bottom: "10px",
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="text"
              style={{ width: "55vw", height: "30px" }}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              style={{
                border: "none",
                backgroundColor: "blue",
                color: "white",
                padding: "10px 20px",
              }}
              onClick={() => {
                if (inputMessage.trim() != "") {
                  handleSendMessage();
                } else {
                  setInputMessage(inputMessage.trim());
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
