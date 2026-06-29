import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>CampusRide</h2>

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