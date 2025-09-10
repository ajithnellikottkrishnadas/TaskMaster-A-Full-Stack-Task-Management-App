import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./user.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/user/register", formData);
      toast.success(res.data.message || "Registered successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="addUser">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>

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

        <button type="submit">Register</button>
      </form>

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <p>Already have an account?</p>
        <Link to="/">
          <button type="button" className="registerBtn">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Register;
