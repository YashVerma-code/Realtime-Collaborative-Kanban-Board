import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuthStore } from "./stores/useAuthStore.js";
import { useEffect } from "react";
// import { io } from "socket.io-client";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import ActivityLog from "./pages/ActivityLog/ActivityLog.jsx";
import "./App.css";
import { useBoardStore } from "./stores/useBoardStore.js";
import { useTaskStore } from "./stores/useTaskStore.js";
import Profile from "./pages/Profile/Profile.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth, socket ,fetchUsers} = useAuthStore();
  const { setTasks } = useTaskStore();
  const { selectedBoard,getBoards,fetchLogs } = useBoardStore();
  // const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth, isCheckingAuth]);

 useEffect(() => {
  if (!socket) return;

  const refreshBoards = () => {
    getBoards();     
    fetchUsers(); 
  };

  socket.on("board:create", refreshBoards);
  socket.on("board:update", refreshBoards);
  socket.on("board:delete", refreshBoards);
  socket.on("board:memberAdded", refreshBoards);
  socket.on("recentActions",(data)=>{
    console.log("From socket : ",data);
    fetchLogs()
  })
  return () => {
    socket.off("board:create");
    socket.off("board:update");
    socket.off("board:delete");
    socket.off("board:memberAdded");
    socket.off("recentActions");
  };
}, [socket]);


 useEffect(() => {
  if (!socket || !selectedBoard) return;

  socket.emit("joinBoard", selectedBoard._id);

  const handleTaskUpdate = (task) => {
    console.log({ type: "UPDATE_TASK", task });
    setTasks();
  };

  socket.on("task:create", handleTaskUpdate);
  socket.on("task:update", handleTaskUpdate);
  socket.on("task:delete", handleTaskUpdate);
  socket.on("task:statusupdate", handleTaskUpdate);

  return () => {
    socket.emit("leaveBoard", selectedBoard._id);
    socket.off("task:create", handleTaskUpdate);
    socket.off("task:update", handleTaskUpdate);
    socket.off("task:delete", handleTaskUpdate);
    socket.off("task:statusupdate", handleTaskUpdate);
  };
}, [socket, selectedBoard]);


  if (isCheckingAuth && !authUser) {
    return (
      <div className="loading-container">
        <span className="loading-infinity"></span>
      </div>
    );
  } else {
    return (
      <div className="app-container">
        {authUser && <Navbar />}

        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/activitylog"
            element={authUser ? <ActivityLog /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <Signup /> : <Navigate to="/" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    );
  }
}

export default App;
