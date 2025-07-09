import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://realtime-collaborative-kanban-board.vercel.app",
  process.env.FRONTEND_URL
];

app.set('trust proxy', 1);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const server = http.createServer(app);
console.log("frontend: ", process.env.FRONTEND_URL);

const io = new Server(server, {
   cors: {
    origin: ["http://localhost:5173","https://realtime-collaborative-kanban-board.vercel.app",process.env.FRONTEND_URL],
    credentials: true
  }
});
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Validate JWT token here
  if (isValidToken(token)) {
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  console.log("Rooms: ",socket.rooms)
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("joinBoard", (boardId) => {
    socket.join(boardId.toString());
    console.log(`👥  ${socket.id} joined board ${boardId}`);
  });

  socket.on("leaveBoard", (boardId) => socket.leave(boardId.toString()));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];
      console.log("👥 Updated userSocketMap after disconnect:", userSocketMap);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  socket.on("error", (error) => {
    console.error("🚨 Socket error:", error);
  });
});

export { io, app, server };
