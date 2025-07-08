import React, { useEffect } from "react";
import "./home.css";
import { useAuthStore } from "../../stores/useAuthStore.js";
import BoardList from "../../components/Board-component/BoardList.jsx";
import BoardContainer from "../../components/Board-component/BoardContainer.jsx";
import { useBoardStore } from "../../stores/useBoardStore.js";
import { useTaskStore } from "../../stores/useTaskStore.js";

const Home = () => {
  const { authUser } = useAuthStore();
  // const [boards, setBoards] = useState([]);
  const {
    boards,
    selectedBoard,
    setSelectedBoard,
    setBoards,
    getBoards,
    getBoardWithId,
    createBoard,
  } = useBoardStore();
  return (
    <div className="home-app">
      <BoardList />
      <BoardContainer />
    </div>
  );
};

export default Home;
