import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const GetTasks = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [assignedToMe, setAssignedToMe] = useState([]);
  const [assignedByMe, setAssignedByMe] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");
      try {
        const res = await axios.get("http://localhost:8000/api/user/list/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyTasks(res.data.myTasks);
        setAssignedToMe(res.data.assignedToMe);
        setAssignedByMe(res.data.assignedByMe);
      } catch {
        toast.error("Failed to get tasks");
        navigate("/");
      }
    };
    fetchTasks();
  }, [navigate]);

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/user/list/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted");
      setMyTasks((prev) => prev.filter((task) => task._id !== id));
      setAssignedByMe((prev) => prev.filter((task) => task._id !== id));
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
      <div className="task-column">
        <h2>Assigned to Me</h2>

        <h3>My Tasks</h3>
        {myTasks.length === 0 && <p>No tasks found.</p>}
        {myTasks.map((task) => (
          <div key={task._id} className="taskContainer">
            <div className="taskContent">
              <h3 className="taskTitle">{task.title}</h3>
              <p className="taskDescription">{task.description}</p>
              <div className="taskMeta">
                <small className="taskStatus">Status: {task.status}</small>
              </div>
            </div>
            <div className="taskActions">
              <button className="edit" onClick={() => navigate(`/updateTask/${task._id}`)}>Edit</button>
              <button className="delete" onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </div>
        ))}

        <h3>Assigned by Others</h3>
        {assignedToMe.length === 0 && <p>No tasks assigned by others.</p>}
        {assignedToMe.map((task) => (
          <div key={task._id} className="taskContainer">
            <div className="taskContent">
              <h3 className="taskTitle">{task.title}</h3>
              <p className="taskDescription">{task.description}</p>
              <div className="taskMeta">
                <small className="taskStatus">Status: {task.status}</small>
                <small className="taskAssigned">Assigned by: {task.createdBy?.name}</small>
              </div>
            </div>
            <div className="taskActions">
              <button className="edit" onClick={() => navigate(`/updateTask/${task._id}`)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      <div className="task-column">
        <div className="task-header">
          <h2>Assigned to Others</h2>
          <button onClick={() => navigate("/addTask")}>Add Task</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        {assignedByMe.length === 0 && <p>No tasks assigned to others.</p>}
        {assignedByMe.map((task) => (
          <div key={task._id} className="taskContainer">
            <div className="taskContent">
              <h3 className="taskTitle">{task.title}</h3>
              <p className="taskDescription">{task.description}</p>
              <div className="taskMeta">
                <small className="taskStatus">Status: {task.status}</small>
                <small className="taskAssigned">Assigned to: {task.assignedTo?.name}</small>
              </div>
            </div>
            <div className="taskActions">
              <button className="edit" onClick={() => navigate(`/updateTask/${task._id}`)}>Edit</button>
              <button className="delete" onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetTasks;
