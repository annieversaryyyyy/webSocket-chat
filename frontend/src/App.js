import React, { useEffect, useRef, useState } from "react";


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
      <p>
        <input
          type="text"
          value={userName}
          name="userName"
          onChange={(e) => setUserName(e.target.value)}
        />
      </p>
      <button onClick={changeUserName}>set username</button>
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
            <p>
              {message.username} {message.text}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
