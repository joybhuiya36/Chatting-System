/* eslint-disable @next/next/no-img-element */
"use client";
import useChat from "@/customHooks/chatCustomHooks";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import logo from "@/../../public/chatlogo.png";
import { IoExitOutline } from "react-icons/io5";

const socket = io.connect(process.env.NEXT_PUBLIC_BACKEND_URL);

const Chat = () => {
  const navigate = useRouter();
  const [recipient, setRecipient] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [recipientName, setRecipientName] = useState(null);
  const userName = localStorage.getItem("name");
  const userImage = localStorage.getItem("image");
  const {
    createRoom,
    allChats,
    getChatsWithAll,
    chatMessages,
    getOneChat,
    sendMessage,
    searchUsers,
    userSearchResult,
  } = useChat();
  const [chatRoomId, setchatRoomId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [chats, setChats] = useState([]);
  const { param } = useParams();
  const chatContainerRef = useRef(null);
  useEffect(() => {
    getChatsWithAll(param);
  }, []);
  useEffect(() => {
    searchUsers(searchKeyword);
  }, [searchKeyword]);
  useEffect(() => {
    setChats(chatMessages);
  }, [chatMessages]);
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    console.log("chats");
  }, [chats]);

  useEffect(() => {
    socket.emit("join_room", chatRoomId);
  }, [chatRoomId]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("rec");
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
  const handleChatRoom = (roomID, users) => {
    getOneChat(roomID);
    setchatRoomId(roomID);
    if (users[0]._id == param) {
      setRecipient(users[1]?._id);
      setAvatar(users[1]?.image);
      setRecipientName(users[1]?.name);
    } else {
      setRecipient(users[0]?._id);
      setAvatar(users[0]?.image);
      setRecipientName(users[0]?.name);
    }
    if (chatRoomId) socket.emit("leave_room", chatRoomId);
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
  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("image");
    localStorage.removeItem("token");
    navigate.push("/");
  };
  return (
    <div className="chats">
      <div className="chats__header-bar">
        <div className="chats__logo">ChatBox</div>
        <div className="chats__search">
          <IoSearch className="chats__search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="chats__search-input"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingRight: "20px",
          }}
        >
          <img
            src={userImage}
            alt="img"
            style={{
              height: "40px",
              width: "40px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <span style={{ fontWeight: "700", color: "white" }}>{userName}</span>
          <div
            style={{ cursor: "pointer", marginLeft: "10px" }}
            onClick={handleLogout}
          >
            <IoExitOutline style={{ fontSize: "25px", color: "white" }} />
          </div>
        </div>
      </div>
      <div className="chats__wrapper">
        <div className="chats__left">
          {allChats?.map((chat, index) => (
            <div
              style={{
                backgroundColor: `${
                  chat?.roomId == chatRoomId ? "#0d7a6d" : ""
                }`,
              }}
              className="chats__left__chatlist"
              key={index}
              onClick={() => {
                handleChatRoom(chat?.roomId, chat?.users);
              }}
            >
              {chat?.users?.map(
                (user, index) =>
                  user?._id != param && (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <img
                        src={user?.image}
                        alt="img"
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
        <div className="chats__right">
          {chatRoomId ? (
            <div className="chats__profile-bar">
              <Image
                src={avatar}
                alt="profile-picture"
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
              <div>{recipientName}</div>
            </div>
          ) : (
            <div className="chats__welcome">
              <Image src={logo} alt="logo" width={200} height={200} />
              <div className="chats__welcome-text">Welcome to ChatBox</div>
            </div>
          )}
          <div className="chats__right-messages" ref={chatContainerRef}>
            {chats?.map((chat, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "8px",
                  margin: " 3px 0",
                  justifyContent:
                    param === chat?.user?._id ? "flex-end" : "flex-start",
                  padding: "0 15px",
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
                      alignSelf:
                        param == chat?.user?._id ? "end" : "flex-start",
                    }}
                  >
                    {chat?.content}
                  </span>
                  <span
                    style={{
                      display: "block",
                      color: "gray",
                      fontSize: "12px",
                    }}
                  >
                    {ToBDTime(chat?.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {chatRoomId && (
              <form
                style={{
                  position: "fixed",
                  bottom: "20px",
                  left: "430px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  className="chats__message-input"
                  type="text"
                  placeholder="Type your message"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button
                  className="chats__button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (inputMessage.trim() != "") {
                      handleSendMessage();
                    } else {
                      setInputMessage(inputMessage.trim());
                    }
                  }}
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="chats__modal">
        {userSearchResult?.length > 0 &&
          userSearchResult?.map((user) => (
            <div
              className="chats__modal__user"
              onClick={() => {
                createRoom(param, user._id);
                setRecipient("");
                setSearchKeyword("");
              }}
            >
              <Image
                src={user?.image}
                alt="avatar"
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
              <div>{user?.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Chat;
