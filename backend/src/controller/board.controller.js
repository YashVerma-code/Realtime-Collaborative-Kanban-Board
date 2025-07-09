import { logAction } from "../lib/logAction.js";
import { io } from "../lib/socket.js";
import Board from "../model/board.model.js";

export const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const oldboard = await Board.findOne({
      name: name.trim().toLowerCase(),
    });

    if (oldboard) {
      return res.status(400).json({
        message: "Board with this name already exists",
      });
    }
    const board = await Board.create({
      name: name.trim().toLowerCase(),
      owner: req.user._id,
      members: [req.user._id],
      tasks: [],
    });
    await logAction(
      req.user.id,"",
      board._id,
      "created",
      `${name.trim().toUpperCase()}  is created !`
    );
    io.emit("board:create", board);
    io.emit("recentActions", board);
    res.status(201).json(board);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getBoards = async (req, res) => {
  // boards where user is owner OR member
  try {
    const boards = await Board.find({
      members: req.user._id,
    }).sort({ updatedAt: -1 });
    res.status(200).json(boards);
  } catch (error) {
    console.log("Error occured in gettingBoards: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate(
      "members",
      "fullName _id email profilePic createdAt updatedAt"
    );
    if (!board) return res.status(404).json({ message: "Board not found" });

    const isMember = board.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "User is not member of this board" });
    }

    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (!board.owner.equals(req.user._id))
      return res.status(403).json({ message: "Only owner can edit" });
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    await logAction(
      req.user.id,
      (boardId = board._id),
      "updated",
      `${board.name.trim().toUpperCase()}  is updated !`
    );
    io.emit("board:update", updatedBoard);
    io.emit("recentActions", updatedBoard);
    return res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    if (!board.owner.equals(req.user._id))
      return res.status(403).json({ message: "Only owner can delete" });

    const deletedBoard = board.toObject(); // convert to plain JS object
    await board.deleteOne();
    await logAction(
      req.user.id,
      "",deletedBoard._id,
      "deleted",
      `${board.name.trim().toUpperCase()}  is deleted !`
    );
    io.emit("board:delete", deletedBoard);
    io.emit("recentActions", deletedBoard);
    res.status(200).json({
      message: "Board deleted successfully",
      board: deletedBoard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const addmembers = async (req, res) => {
  try {
    const boardId = req.params.id;
    const { memberIds } = req.body; // expecting an array of user IDs

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "No members provided." });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Prevent adding duplicates by using a Set
    const existingMemberIds = new Set(board.members.map((id) => id.toString()));
    const newMembers = memberIds.filter((id) => !existingMemberIds.has(id));

    if (newMembers.length === 0) {
      return res.status(200).json({ message: "Members are already added" });
    }

    board.members.push(...newMembers);
    await board.save();
    const updatedBoard = await Board.findById(boardId).populate(
      "members",
      "fullName email profilePic"
    );
    io.emit("board:memberAdded", updatedBoard);
    res.status(200).json({ message: "Members added", board: updatedBoard });
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
