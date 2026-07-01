/* eslint-disable react-hooks/set-state-in-effect */
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    available: 0,
    myRides: 0,
    created: 0,
    history: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [availableRes, myRidesRes, createdRes, historyRes] =
        await Promise.all([
          api.get("/rides"),
          api.get("/rides/myrides"),
          api.get("/rides/created"),
          api.get("/rides/history"),
        ]);

      setStats({
        available: availableRes.data.data.rides.length,
        myRides: myRidesRes.data.data.rides.length,
        created: createdRes.data.data.rides.length,
        history: historyRes.data.data.rides.length,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stats");
    } finally {
      setLoading(false);
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

        {loading && <LoadingSpinner label="Loading dashboard stats..." />}
        {error && <p>{error}</p>}

        {!loading && !error && Object.values(stats).every((count) => count === 0) && (
          <EmptyState
            title="No rides yet"
            description="Once you create, join, or complete rides, your dashboard summary will appear here."
          />
        )}

        {!loading && !error && (
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
        )}

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