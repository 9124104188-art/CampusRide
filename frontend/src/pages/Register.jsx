import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    college: "",
    department: "",
    year: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="college" placeholder="College" onChange={handleChange} />
        <input name="department" placeholder="Department" onChange={handleChange} />
        <input name="year" placeholder="Year" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;