"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const App = () => {
  const [id, setId] = useState("");
  const navigate = useRouter();

  const inputStyle = {
    padding: "8px",
    marginRight: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const buttonStyle = {
    padding: "10px 16px",
    border: "none",
    backgroundColor: "#3498db",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div
      style={{
        height: "100vh",
        textAlign: "center",
        alignSelf: "center",
        marginTop: "40%",
      }}
    >
      <h2>Enter Your User Number</h2>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={inputStyle}
      />
      <button onClick={() => navigate.push(`/chat/${id}`)} style={buttonStyle}>
        Go to Chatbox
      </button>
    </div>
  );
};

export default App;
