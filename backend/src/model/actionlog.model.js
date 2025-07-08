import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  action: {
    type: String,
    enum: ["created", "updated", "deleted", "assigned", "moved"],
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  details: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ActionLog =
  mongoose.models.ActionLog || mongoose.model("ActionLog", actionLogSchema);
export default ActionLog;
