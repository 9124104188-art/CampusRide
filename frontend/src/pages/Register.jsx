import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    college: "",
    department: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await register(formData);
      showToast(data.message, "success");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="page-header">
        <h1>Register</h1>
        <p>Create your student profile to start sharing rides.</p>
      </div>

      {error && <p>{error}</p>}

      <form className="auth-form" onSubmit={handleRegister}>
        <label className="field">
          <span>Name</span>
          <input name="name" placeholder="Your full name" onChange={handleChange} />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" placeholder="Your college email" onChange={handleChange} />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            name="password"
            placeholder="Create a password"
            type="password"
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <span>Phone</span>
          <input name="phone" placeholder="Your phone number" onChange={handleChange} />
        </label>
        <label className="field">
          <span>College</span>
          <input name="college" placeholder="College name" onChange={handleChange} />
        </label>
        <label className="field">
          <span>Department</span>
          <input name="department" placeholder="Department name" onChange={handleChange} />
        </label>
        <label className="field">
          <span>Year</span>
          <input name="year" placeholder="1 - 5" onChange={handleChange} />
        </label>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;