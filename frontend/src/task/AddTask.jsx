import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddTask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    assignedTo: "",
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:8000/api/user/list/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }
      const payload = { ...task };
      if (!task.assignedTo) delete payload.assignedTo;

      await axios.post("http://localhost:8000/api/user/list/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Task added successfully!");
      navigate("/tasks");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to add task";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="update-task-container">
      <h2 className="update-task-title">Add New Task</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
        >
          <option value="pending">Pending</option>
          <option value="complete">Complete</option>
        </select>
        <select
          name="assignedTo"
          value={task.assignedTo}
          onChange={handleChange}
        >
          <option value="">Assign to Myself</option>
          {users.map((user) => (
            <option value={user._id} key={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
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

export default AddTask;
