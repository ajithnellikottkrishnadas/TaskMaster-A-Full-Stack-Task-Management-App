import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../App.css";

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    assignedTo: "",
    createdBy: "",
  });
  const [users, setUsers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
    fetchUsers();
  }, [id]);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/user/list/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allTasks = [
        ...res.data.myTasks,
        ...res.data.assignedByMe,
        ...res.data.assignedToMe,
      ];

      const foundTask = allTasks.find((t) => t._id === id);
      if (!foundTask) return navigate("/tasks");

      const currentUserId = JSON.parse(atob(token.split(".")[1])).id;

      setIsCreator(
        (foundTask.createdBy?._id || foundTask.createdBy) === currentUserId
      );

      setTask({
        title: foundTask.title,
        description: foundTask.description,
        status: foundTask.status,
        assignedTo: foundTask.assignedTo?._id || "",
        createdBy: foundTask.createdBy?._id || foundTask.createdBy,
      });

      setLoading(false);
    } catch {
      toast.error("Failed to load task");
      navigate("/tasks");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/user/list/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const handleChange = (e) =>
    setTask({ ...task, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Only creator can update title and assignedTo
      const updateData = {
        description: task.description,
        status: task.status,
      };

      if (isCreator) {
        updateData.title = task.title;
        updateData.assignedTo = task.assignedTo || undefined;
      }

      await axios.put(
        `http://localhost:8000/api/user/list/update/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Task updated successfully");
      navigate("/tasks");
    } catch {
      toast.error("Failed to update task");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="update-task-container">
      <h2 className="update-task-title">Update Task</h2>
      <form onSubmit={handleSubmit} className="update-task-form">
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          required
          disabled={!isCreator} // Only creator can edit title
        />
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          disabled={!isCreator}
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
          disabled={!isCreator} // Only creator can reassign
        >
          <option value="">Assign to myself</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
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

export default UpdateTask;
