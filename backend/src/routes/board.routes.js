import express from "express";
import {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
  addmembers
} from "../controller/board.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getactionLogs } from "../controller/actionlog.controller.js";

const router = express.Router();

router.get("/actions/recent",isAuthenticated, getactionLogs);
router.get("/", isAuthenticated, getBoards);
router.post("/", isAuthenticated, createBoard);
router.get("/:id", isAuthenticated, getBoard);
router.put("/:id", isAuthenticated, updateBoard);
router.delete("/:id", isAuthenticated, deleteBoard);
router.post("/add-members/:id",isAuthenticated,addmembers);
export default router;
