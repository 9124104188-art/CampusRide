import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link className="brand" to="/dashboard">
        CampusRide
      </Link>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/rides">Available Rides</Link>
        <Link to="/my-rides">My Rides</Link>
        <Link to="/create-ride">Create Ride</Link>
        <Link to="/created-rides">Created Rides</Link>
        <Link to="/history">Ride History</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;