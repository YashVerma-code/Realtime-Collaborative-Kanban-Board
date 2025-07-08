import ActionLog from "../model/actionlog.model.js";

export const logAction = async (
  userId,
  taskId,
  boardId,
  actionType,
  message
) => {
  try {
    console.log("added data to activitylog");
    const action = {
      user: userId,
      boardId,
      action: actionType,
      details: message,
      timestamp: new Date(),
    };

    if (taskId) {
      action.task = taskId;
    }

    await ActionLog.create(action);
  } catch (error) {
    console.error("Action logging failed:", error.message);
  }
};
