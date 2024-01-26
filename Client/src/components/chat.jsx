"use client";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect(process.env.NEXT_PUBLIC_BACKEND_URL);

function Chat() {
  const [room, setRoom] = useState("");

  const [message, setMessage] = useState("");
  const [allmsg, setAllMsg] = useState([]);
  const [messageReceived, setMessageReceived] = useState("");

  useEffect(() => {
    // socket.emit("join_room", room);
  }, []);
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    console.log("count");
    socket.on("receive_message", (data) => {
      setAllMsg((prevAllMsg) => [...prevAllMsg, data.message]);
      // console.log("rec");
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button
        onClick={() => {
          sendMessage();
          setAllMsg([...allmsg, message]);
        }}
      >
        Send Message
      </button>
      <h1> Message:</h1>
      {messageReceived}
      <br />
      <br />
      <br />
      {[...allmsg].reverse()?.map((msg) => (
        <p>{msg}</p>
      ))}
    </div>
  );
}

export default Chat;
