import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [userName, setUserName] = useState("");

  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/chat");
    ws.current = socket;

    socket.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data);

      if (decodedMessage.type === "NEW_MESSAGE") {
        setMessages((prev) => [...prev, decodedMessage.message]);
      }

      if (decodedMessage.type === "CONNECTED") {
        setUserName(decodedMessage.username);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    ws.current.send(
      JSON.stringify({
        type: "CREATE_MESSAGE",
        message: messageText,
      }),
    );
  };

  const changeUserName = () => {
    ws.current.send(
      JSON.stringify({
        type: "SET_USERNAME",
        userName,
      }),
    );
  };

  return (
    <>
     <div className="chat-container">
      <header className="chat-header">
        <h2>Live Chat</h2>
        <div className="user-block">
          <input
            type="text"
            value={userName}
            placeholder="Your name"
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={changeUserName}>Change</button>
        </div>
      </header>

      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message-card">
            <div className="message-author">{message.username}</div>
            <div className="message-text">{message.text}</div>
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={messageText}
          placeholder="Write a message..."
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
    </>
  );
};

export default App;
