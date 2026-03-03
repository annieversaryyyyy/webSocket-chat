import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import CanvasDemo from "./CanvasDemo";
import { apiUrl } from "./api/apiUrl";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [isCanvasOpen, setIsCanvasOpen] = useState(true);

  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(apiUrl);
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
    if (!messageText.trim() && !imageUrl.trim()) {
      return;
    }

    ws.current.send(
      JSON.stringify({
        type: "CREATE_MESSAGE",
        message: messageText,
        imageUrl: imageUrl || null,
      }),
    );
    setMessageText("");
    setImageUrl("");
  };

  const changeUserName = () => {
    ws.current.send(
      JSON.stringify({
        type: "SET_USERNAME",
        userName,
      }),
    );
  };

  const openCanvas = () => {
    setIsCanvasOpen(true);
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
              {message.text && (
                <div className="message-text">{message.text}</div>
              )}
              {message.type === "image" && message.content && (
                <img
                  className="message-image"
                  src={message.content}
                  alt="attachment"
                />
              )}
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
          <input
            type="text"
            value={imageUrl}
            placeholder="Image URL (optional)"
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
          <button onClick={openCanvas}>Draw</button>
        </div>
      </div>
      {isCanvasOpen && <CanvasDemo onClose={() => setIsCanvasOpen(false)} />}
    </>
  );
};

export default App;
