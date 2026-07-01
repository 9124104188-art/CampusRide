/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import RideRouteInfo from "../components/RideRouteInfo";
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

        {loading && <LoadingSpinner label="Loading ride history..." />}
        {error && <p>{error}</p>}

        {rides.length === 0 && !loading && (
          <EmptyState
            title="No ride history yet"
            description="Completed or cancelled rides will appear here once you start using the app."
          />
        )}

        {rides.map((ride) => (
          <div className="card" key={ride._id}>
            <div className="card-top">
              <div>
                <h3>
                  {ride.pickup} → {ride.destination}
                </h3>
                <p className="card-subtitle">Departing at {ride.departureTime}</p>
              </div>

              <span className={`status-badge status-${ride.status}`}>
                {ride.status}
              </span>
            </div>

            <p className="card-meta">Vehicle: {ride.vehicleDetails}</p>
            <p className="card-meta">Fare: ₹{ride.farePerStudent}</p>

            <RideRouteInfo ride={ride} />

            <div className="seat-meter" aria-label={`Seats filled ${ride.riders.length} of ${ride.maxSeats}`}>
              <div className="seat-meter-row">
                <span>Seats filled</span>
                <strong>{ride.riders.length}/{ride.maxSeats}</strong>
              </div>
              <div className="seat-meter-track">
                <div
                  className="seat-meter-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, ride.riders.length / ride.maxSeats * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default RideHistory;