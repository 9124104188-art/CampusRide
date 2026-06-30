/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/NavBar";

function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/rides/history");
      setRides(res.data.data.rides);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch ride history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Ride History</h1>

        {loading && <p>Loading history...</p>}
        {error && <p>{error}</p>}

        {rides.length === 0 && !loading && <p>No ride history found.</p>}

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
          </div>
        ))}
      </div>
    </>
  );
}

export default RideHistory;