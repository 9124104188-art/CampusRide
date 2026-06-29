/* eslint-disable react-hooks/set-state-in-effect */
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({
  available: 0,
  myRides: 0,
  created: 0,
  history: 0,
});
const fetchStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const availableRes = await axios.get("http://localhost:5000/api/rides", {
      headers,
    });

    const myRidesRes = await axios.get("http://localhost:5000/api/rides/myrides", {
      headers,
    });

    const createdRes = await axios.get("http://localhost:5000/api/rides/created", {
      headers,
    });

    const historyRes = await axios.get("http://localhost:5000/api/rides/history", {
      headers,
    });

    setStats({
      available: availableRes.data.rides.length,
      myRides: myRidesRes.data.rides.length,
      created: createdRes.data.rides.length,
      history: historyRes.data.rides.length,
    });
  } catch (error) {
    console.log(error.response?.data?.message || "Failed to fetch stats");
  }
};
useEffect(() => {
  fetchStats();
}, []);

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Dashboard</h1>
        <h2>Welcome {user?.name}</h2>
        <p>Email: {user?.email}</p>

        <div className="stats-grid">
  <div className="stat-card">
    <h3>{stats.available}</h3>
    <p>Available Rides</p>
  </div>

  <div className="stat-card">
    <h3>{stats.myRides}</h3>
    <p>My Rides</p>
  </div>

  <div className="stat-card">
    <h3>{stats.created}</h3>
    <p>Created Rides</p>
  </div>

  <div className="stat-card">
    <h3>{stats.history}</h3>
    <p>Ride History</p>
  </div>
</div>

        <div className="dashboard-grid">
          <Link className="dashboard-card" to="/create-ride">
            <h3>Create Ride</h3>
            <p>Offer a ride to other students</p>
          </Link>

          <Link className="dashboard-card" to="/rides">
            <h3>Available Rides</h3>
            <p>Find rides offered by students</p>
          </Link>
          <Link to="/history" className="dashboard-card">
  <h3>Ride History</h3>
  <p>View your completed and cancelled rides</p>
</Link>

          <Link className="dashboard-card" to="/my-rides">
            <h3>My Rides</h3>
            <p>View rides you created or joined</p>
          </Link>
          <Link className="dashboard-card" to="/created-rides">
  <h3>Created Rides</h3>
  <p>View rides you created as a driver</p>
</Link>
        </div>
      </div>
    </>
  );
}

export default Dashboard;