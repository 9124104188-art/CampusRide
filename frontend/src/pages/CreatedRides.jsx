/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/NavBar";

function CreatedRides() {
  const [editingRideId, setEditingRideId] = useState(null);
  const [editData, setEditData] = useState({
    pickup: "",
    destination: "",
    departureTime: "",
    vehicleDetails: "",
    maxSeats: "",
    farePerStudent: "",
  });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCreatedRides = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/rides/created");
      setRides(res.data.data.rides);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch created rides");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (ride) => {
    setEditingRideId(ride._id);
    setEditData({
      pickup: ride.pickup,
      destination: ride.destination,
      departureTime: ride.departureTime,
      vehicleDetails: ride.vehicleDetails,
      maxSeats: ride.maxSeats,
      farePerStudent: ride.farePerStudent,
    });
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateRide = async (rideId) => {
    try {
      const res = await api.put(`/rides/${rideId}`, editData);
      alert(res.data.message);
      setEditingRideId(null);
      fetchCreatedRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update ride");
    }
  };

  const handleDeleteRide = async (rideId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ride?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await api.delete(`/rides/${rideId}`);
      alert(res.data.message);
      setRides(rides.filter((ride) => ride._id !== rideId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete ride");
    }
  };

  const handleStatusChange = async (rideId, status) => {
    const confirmStatus = window.confirm(
      `Are you sure you want to mark this ride as ${status}?`
    );

    if (!confirmStatus) {
      return;
    }

    try {
      const res = await api.put(`/rides/${rideId}/status`, { status });
      alert(res.data.message);
      fetchCreatedRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchCreatedRides();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Created Rides</h1>

        {loading && <p>Loading rides...</p>}
        {error && <p>{error}</p>}

        {rides.length === 0 && !loading && (
          <p>You have not created any rides yet.</p>
        )}

        {rides.map((ride) => (
          <div className="card" key={ride._id}>
            <h3>
              {ride.pickup} → {ride.destination}
            </h3>
            <p>Departure: {ride.departureTime}</p>
            <p>Vehicle: {ride.vehicleDetails}</p>
            <p>Fare: ₹{ride.farePerStudent}</p>
            <p>Status: {ride.status}</p>
            <p>
              Seats Filled: {ride.riders.length}/{ride.maxSeats}
            </p>

            <h4>Joined Students</h4>

            {ride.riders.length === 0 ? (
              <p>No students joined yet.</p>
            ) : (
              ride.riders.map((rider) => (
                <div className="student-card" key={rider._id}>
                  <p>
                    <strong>Name:</strong> {rider.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {rider.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {rider.phone}
                  </p>
                </div>
              ))
            )}

            {editingRideId === ride._id ? (
              <div>
                <input
                  name="pickup"
                  value={editData.pickup}
                  onChange={handleEditChange}
                />
                <input
                  name="destination"
                  value={editData.destination}
                  onChange={handleEditChange}
                />
                <input
                  name="departureTime"
                  value={editData.departureTime}
                  onChange={handleEditChange}
                />
                <input
                  name="vehicleDetails"
                  value={editData.vehicleDetails}
                  onChange={handleEditChange}
                />
                <input
                  name="maxSeats"
                  value={editData.maxSeats}
                  onChange={handleEditChange}
                />
                <input
                  name="farePerStudent"
                  value={editData.farePerStudent}
                  onChange={handleEditChange}
                />

                <button onClick={() => handleUpdateRide(ride._id)}>Save</button>
                <button onClick={() => setEditingRideId(null)}>Cancel</button>
              </div>
            ) : (
              ride.status !== "completed" && (
                <>
                  <button onClick={() => startEdit(ride)}>Edit Ride</button>
                  <button onClick={() => handleDeleteRide(ride._id)}>
                    Delete Ride
                  </button>
                </>
              )
            )}

            {ride.status === "available" && (
              <button onClick={() => handleStatusChange(ride._id, "started")}>
                Start Ride
              </button>
            )}

            {ride.status === "started" && (
              <button
                onClick={() => handleStatusChange(ride._id, "completed")}
              >
                Complete Ride
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default CreatedRides;