/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";

function MyRides() {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyRides = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/rides/myrides");
      setRides(res.data.data.rides);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch my rides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  const handleLeaveRide = async (rideId) => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave this ride?"
    );

    if (!confirmLeave) {
      return;
    }

    try {
      const res = await api.post(`/rides/${rideId}/leave`);
      alert(res.data.message);
      fetchMyRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave ride");
    }
  };

  return (
    <div className="page">
      <Navbar />
      <h1>My Rides</h1>

      {loading && <p>Loading rides...</p>}
      {error && <p>{error}</p>}

      {rides.map((ride) => {
        const isDriver = ride.driverId.toString() === user.id.toString();
        const hasJoined = ride.riders.some(
          (riderId) => riderId.toString() === user.id.toString()
        );

        return (
          <div className="card" key={ride._id}>
            <h3>
              {ride.pickup} → {ride.destination}
            </h3>
            <p>Role: {isDriver ? "Driver" : "Rider"}</p>
            <p>Departure: {ride.departureTime}</p>
            <p>Vehicle: {ride.vehicleDetails}</p>
            <p>Status: {ride.status}</p>
            <p>
              Seats: {ride.riders.length}/{ride.maxSeats}
            </p>

            {!isDriver && hasJoined && (
              <button onClick={() => handleLeaveRide(ride._id)}>
                Leave Ride
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MyRides;