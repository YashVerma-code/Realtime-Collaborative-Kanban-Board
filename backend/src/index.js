import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import boardRoutes from "./routes/board.routes.js";
import dbConnect from "./lib/dbconnect.js";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/api", (req, res) => {
  res.json({ message: "Kanban Board API is running!", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    dbConnect();
});

