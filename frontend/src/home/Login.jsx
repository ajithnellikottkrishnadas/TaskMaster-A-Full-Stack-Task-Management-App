import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./user.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/user/login", formData);
      toast.success(res.data.message || "Login successful");
      localStorage.setItem("token", res.data.token);
      navigate("/tasks");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="addUser">
      <h3>User Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        <div className="inputGroup">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <p>Haven’t registered?</p>
        <Link to="/register">
          <button type="button" className="registerBtn">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
