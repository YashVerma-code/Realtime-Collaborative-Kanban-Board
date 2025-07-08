import { io } from "../lib/socket.js";
import ActionLog from "../model/actionlog.model.js";
import Board from "../model/board.model.js";

export const getactionLogs = async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .sort({ timestamp: -1 })
      .limit(20) 
      .populate("user", "fullName")
      .populate("task", "title");

    res.status(200).json({ logs, totalLogs: logs.length }); 
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch action logs" });
  }
};

