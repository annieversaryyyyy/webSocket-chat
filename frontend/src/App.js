import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/chat");

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data);

      if (decodedMessage.type === "NEW_MESSAGE") {
        setMessages((prev) => [...prev, decodedMessage.message]);
      }
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

  return (
    <>
      <p>
        <input
          type="text"
          value={messageText}
          name="messageText"
          onChange={(e) => setMessageText(e.target.value)}
        />
      </p>
      <button onClick={sendMessage}>send</button>

      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>{message}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
