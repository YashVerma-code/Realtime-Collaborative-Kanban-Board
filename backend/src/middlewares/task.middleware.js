import Task from "../model/task.model.js";
import Board from "../model/board.model.js";

const columnSet = ["todo", "in-progress", "done"];

export const validateTaskTitle = async (req, res, next) => {
  try {
    const { title, boardId } = req.body;
    const taskId = req.params.id;
    const normalizedTitle = title.trim().toLowerCase();
    if (!title || !boardId)
      return res.status(400).json({ message: "title and boardId required" });

    if (columnSet.includes(normalizedTitle))
      return res
        .status(400)
        .json({ message: "Title cannot match column names" });

    const dup = await Task.findOne({
      boardId,
      title:normalizedTitle,
      _id: { $ne: taskId },
    });

    if (dup)
      return res
        .status(400)
        .json({ message: "Title must be unique per board" });

    next();
  } catch (error) {
    res.status(500).json({
      message:  error.message,
    });
  }
};

export const checkBoardMembership = async (req, res, next) => {
  try {
    const { boardId } = req.body;
    const userId = req.user._id;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });
    const isMember = board.members.some(
      (member) => member.toString() === userId.toString()
    );
    if (!isMember)
      return res
        .status(403)
        .json({ message: "User is not a member of this board" });
    next();
  } catch (error) {
    res.status(500).json({
      message:  error.message,
    });
  }
};
