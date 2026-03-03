const express = require("express");
const cors = require("cors");
const app = express();
const crypto = require("crypto");

require("express-ws")(app);
const port = 8000;

app.use(cors());
const activeConnections = {};
const pixelsArray = [];

app.ws("/chat", (ws, req) => {
  const id = crypto.randomUUID();
  let username = "Anonymous";

  console.log("Client connected, id=", id);
  activeConnections[id] = ws; //присвоение каждому юзеру айди

  ws.send(
    JSON.stringify({
      type: "CONNECTED",
      username,
      pixelsArray,
    }),
  );

  ws.on("close", () => {
    console.log("client disconnected! id=", id);
    delete activeConnections[id]; //удаление сессии юзера
  });

  ws.on("message", (msg) => {
    const decodedMessage = JSON.parse(msg);
    switch (decodedMessage.type) {
      case "SET_USERNAME":
        username = decodedMessage.userName;
        break;
      case "CREATE_MESSAGE":
        Object.keys(activeConnections).forEach((connId) => {
          const conn = activeConnections[connId];

          conn.send(
            JSON.stringify({
              type: "NEW_MESSAGE",
              message: {
                username,
                text: decodedMessage.message,
              },
            }),
          );
        });
        break;
      case "ADD_PIXELS":
        pixelsArray.push(decodedMessage.pixels);
        Object.keys(activeConnections).forEach((connId) => {
          const conn = activeConnections[connId];
          conn.send(
            JSON.stringify({
              type: "NEW_PIXELS",
              pixels: decodedMessage.pixels,
            }),
          );
        });
        break;
      case "STROKE_END":
        pixelsArray.push({ break: true });
        Object.keys(activeConnections).forEach((connId) => {
          const conn = activeConnections[connId];
          conn.send(
            JSON.stringify({
              type: "STROKE_END",
            }),
          );
        });
        break;
      default:
        console.log("Unknown message", decodedMessage.type);
    }
  });
  console.log(activeConnections);
});

app.listen(port, () => {
  console.log(`Server started on ${port} port`);
});
