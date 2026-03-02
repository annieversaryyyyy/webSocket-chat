const express = require("express");
const cors = require("cors");
const app = express();
const crypto = require("crypto");

require("express-ws")(app);
const port = 8000;

app.use(cors());
const activeConnections = {};

app.ws("/chat", (ws, req) => {
  const id = crypto.randomUUID();
  console.log("Client connected, id=", id);
  activeConnections[id] = ws; //присвоение каждому юзеру айди

  ws.on("close", () => {
    console.log("client disconnected! id=", id);
    delete activeConnections[id]; //удаление сессии юзера
  });

  ws.on("message", (msg) => {
    const decodedMessage = JSON.parse(msg);
    switch (decodedMessage.type) {
      case "CREATE_MESSAGE":
        Object.keys(activeConnections).forEach((connId) => {
          const conn = activeConnections[connId];

          conn.send(
            JSON.stringify({
              type: "NEW_MESSAGE",
              message: decodedMessage.message,
            }),
          );
        });
        break;
      default:
        console.log("Unknown message", decodedMessage.type);
    }
    ws.send(msg);
  });
  console.log(activeConnections);
});

app.listen(port, () => {
  console.log(`Server started on ${port} port`);
});
