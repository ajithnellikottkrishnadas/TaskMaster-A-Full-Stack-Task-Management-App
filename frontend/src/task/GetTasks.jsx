import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import "../App.css";

const GetTasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return navigate("/");
      try {
        const res = await axios.get("http://localhost:8000/api/user/list/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch {
        toast.error("Failed to get tasks");
        navigate("/");
      }
    };
    fetchTasks();
  }, [navigate, token]);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/user/list/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch {
      toast.error("Failed to delete task");
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="task-dashboard">
      <div className="task-header">
        <h2>Tasks Dashboard</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="contained" color="success" onClick={() => navigate("/addTask")}>
            Add Task
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {tasks.length === 0 && <p>No tasks found.</p>}

      <div className="taskList">
        {tasks.map((task) => (
          <div key={task._id} className="taskContainer">
            <div className="taskContent">
              <h3 className="taskTitle">{task.title}</h3>
              <p className="taskDescription">{task.description}</p>
              <small>Status: {task.status}</small>
            </div>
            <div className="taskActions">
              <button className="edit" onClick={() => navigate(`/updateTask/${task._id}`)}>
                <EditIcon />
              </button>
              <button className="delete" onClick={() => deleteTask(task._id)}>
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetTasks;
