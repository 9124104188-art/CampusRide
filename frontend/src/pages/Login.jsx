import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

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
            const res = await axios.post("http://localhost:5000/api/auth/login", formData);
            
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            alert(res.data.message);
            navigate("/dashboard");

        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };
    return (
        <div className="page">
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" placeholder="Password" type="password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;