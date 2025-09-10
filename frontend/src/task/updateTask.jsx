import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../App.css";


const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: "", description: "", status: "Pending" });
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/user/list/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data);
      } catch {
        toast.error("Failed to load task");
      }
    };
    fetchTask();
  }, [id]);
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/api/user/list/update/${id}`, task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task updated");
      navigate("/tasks");
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="update-task-container">
      <h2 className="update-task-title">Update Task</h2>
      <form onSubmit={handleSubmit} className="update-task-form">
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
          required
        />
        <select
          name="status"
          value={task.status}
          onChange={handleChange}
          required
        > <option value="Pending">Pending</option> <option value="Complete">Complete</option>
        </select>

        <div className="update-task-buttons">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/tasks")}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTask;
