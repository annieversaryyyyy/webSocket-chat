<p align="center">
  <img src="https://github.com/user-attachments/assets/7d409bae-8d82-4b48-9e4b-e0920da4fe50" width="250" />
</p>

##  Realtime Chat App with drawing

A realtime chat and drawing application built with **React + WebSocket + Node.js**.

Users can send messages and draw on a canvas while seeing other users' messages and drawings instantly in real time.

---

##  Features

-  Realtime chat (messages appear instantly for all connected users)
-  Live drawing on HTML5 Canvas
- Drawing updates are broadcast in real time
-  Multi-user support
-  Send image 
- Canvas clears after submission

---

##  Tech Stack

### Frontend
- React
- CSS, HTML

### Backend
- Node.js
- Express
- Express-ws 

---

##  How It Works

1. User connects to the WebSocket server
2. Each client receives a unique `userId`
3. Messages are sent through WebSocket and instantly displayed to all users
4. Drawing pixels are streamed in real time
5. The server broadcasts chat messages and drawing updates to every connected client


---

## Installation

### 1️⃣ Clone repository

```bash
git clone https://github.com/annieversaryyyyy/webSocket-chat.git
cd webSocket-chat
```

### 2️⃣ Install dependencies

Backend:

```bash
cd api
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

---

