import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
// import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";

export const useBoardStore = create((set, get) => ({
  selectedBoard: null,
  boards: [],
  isAddingBoard: false,
  isUpdatingBoardId: null,
  isDeletingBoard: false,
  availableBoardMembers: [],
  logs: [],
  totalLogs: 0,

  setSelectedBoard: (value) => {
    set({ selectedBoard: value });
  },
  setBoards: (value) => {
    set({ boards: [...get().boards, value] });
  },
  setIsUpdatingBoardId: (value) => {
    set({ isUpdatingBoardId: value });
  },
  createBoard: async (data) => {
    try {
      set({ isAddingBoard: true });
      const res = await axiosInstance.post("/boards", data);
      set({ boards: [...get().boards, res.data] });
      set({ selectedBoard: res.data });
      toast.success("Board created successfully!");

      // get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isAddingBoard: false });
    }
  },

  getBoards: async () => {
    try {
      const res = await axiosInstance.get("/boards");
      // console.log("Boards fetched:", res.data);
      set({ boards: res.data });
    } catch (error) {
      set({ boards: [] });
      toast.error(error.response.data?.message || "Error in fetching boards");
    }
  },
  getBoardWithId: async (boardId) => {
    try {
      const res = await axiosInstance.get(`/boards/${boardId}`);
      // console.log("Selected Boards : ", res);
      set({ selectedBoard: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateBoard: async (data, boardId) => {
    try {
      const res = await axiosInstance.put(`/boards/${boardId}`, data);
      const updatedBoard = res.data;
      set({
        boards: get().boards.map((b) => (b._id === boardId ? updatedBoard : b)),
      });
      toast.success("Board updated!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  deleteBoard: async (boardId) => {
    try {
      set({ isDeletingBoard: true });
      const res = await axiosInstance.delete(`/boards/${boardId}`);
      const deletedBoard = res.data.board;
      set({
        boards: get().boards.filter((b) => b._id !== deletedBoard._id),
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isDeletingBoard: false });
    }
  },
  addMemebers: async (data, boardId) => {
    try {
      // console.log("Input for addmembers : ", data, boardId);
      const res = await axiosInstance.post(`/boards/add-members/${boardId}`, {
        memberIds: data,
      });
      // console.log("Response from api add members : ", res.data);
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error in adding members : ", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  },
  fetchLogs: async () => {
    try {
      const res = await axiosInstance(`/boards/actions/recent`);
      set({ logs: res.data.logs });
      set({ totalLogs: res.data.totalLogs });
    } catch (error) {
      console.log("Error while fetching logs:", error);
      toast.error(error.response?.data?.message || "Fetch failed");
    }
  },
  fetchboardMembers: async () => {
    try {
      const selectedBoard = get().selectedBoard;

      if (!selectedBoard) {
        toast.error("Board is not selected");
        return;
      }

      const members = selectedBoard.members || [];
      set({ availableBoardMembers: members });

      toast.success("Board members loaded successfully");
    } catch (error) {
      console.log("Error while fetching board members:", error);
      toast.error("Error while fetching board members");
    }
  },
}));
