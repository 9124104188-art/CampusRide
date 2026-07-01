/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import RideRouteInfo from "../components/RideRouteInfo";
import Navbar from "../components/NavBar";
import { useToast } from "../context/useToast";

function AvailableRides() {
  const { showToast } = useToast();
  const [rides, setRides] = useState([]);
  const [pickupSearch, setPickupSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningRideId, setJoiningRideId] = useState(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/rides");
      setRides(res.data.data.rides);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRide = async (rideId) => {
    try {
      setJoiningRideId(rideId);
      const res = await api.post(`/rides/${rideId}/join`);
      showToast(res.data.message, "success");
      await fetchRides();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to join ride", "error");
    } finally {
      setJoiningRideId(null);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const filteredRides = rides.filter((ride) => {
    const pickupMatch = ride.pickup
      .toLowerCase()
      .includes(pickupSearch.toLowerCase());

    const destinationMatch = ride.destination
      .toLowerCase()
      .includes(destinationSearch.toLowerCase());

    const statusMatch =
      statusFilter === "all" || ride.status === statusFilter;

    return pickupMatch && destinationMatch && statusMatch;
  });

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Available Rides</h1>

        {loading && <LoadingSpinner label="Loading available rides..." />}
        {error && <p>{error}</p>}

        <div className="search-box">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="available">Available</option>
          </select>

          <input
            placeholder="Search pickup"
            value={pickupSearch}
            onChange={(e) => setPickupSearch(e.target.value)}
          />

          <input
            placeholder="Search destination"
            value={destinationSearch}
            onChange={(e) => setDestinationSearch(e.target.value)}
          />
        </div>

        {filteredRides.length === 0 && !loading && !error && (
          <EmptyState
            title="No rides found"
            description="Try adjusting your search filters or check back later for new rides."
          />
        )}

        {filteredRides.map((ride) => (
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

            <div className="seat-meter" aria-label={`Seats left ${ride.maxSeats - ride.riders.length} of ${ride.maxSeats}`}>
              <div className="seat-meter-row">
                <span>Seats available</span>
                <strong>{ride.maxSeats - ride.riders.length}/{ride.maxSeats}</strong>
              </div>
              <div className="seat-meter-track">
                <div
                  className="seat-meter-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, (ride.maxSeats - ride.riders.length) / ride.maxSeats * 100))}%`,
                  }}
                />
              </div>
            </div>

            <button
              className="primary-btn"
              onClick={() => handleJoinRide(ride._id)}
              disabled={joiningRideId === ride._id}
            >
              {joiningRideId === ride._id ? "Joining..." : "Join Ride"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default AvailableRides;