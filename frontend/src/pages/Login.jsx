import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/useToast";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      showToast(res.data.message, "success");
      navigate("/dashboard");
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed", "error");
    }
  };

  return (
    <div className="page auth-page">
      <div className="page-header">
        <h1>Login</h1>
        <p>Welcome back. Sign in to manage your rides.</p>
      </div>

      <form className="auth-form" onSubmit={handleLogin}>
        <label className="field">
          <span>Email</span>
          <input name="email" placeholder="Enter your email" onChange={handleChange} />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            name="password"
            placeholder="Enter your password"
            type="password"
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="primary-btn">Login</button>
      </form>
    </div>
  );
}

export default Login;