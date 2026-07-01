/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/NavBar";
import ConfirmationModal from "../components/ConfirmationModal";
import RideRouteInfo from "../components/RideRouteInfo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";
import { useNavigate } from "react-router-dom";

function MyRides() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingRideAction, setPendingRideAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [leavingRideId, setLeavingRideId] = useState(null);

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
    try {
      setLeavingRideId(rideId);
      const res = await api.post(`/rides/${rideId}/leave`);
      showToast(res.data.message, "success");
      await fetchMyRides();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to leave ride", "error");
    } finally {
      setLeavingRideId(null);
    }
  };

  const openLeaveModal = (ride) => {
    setPendingRideAction({
      title: "Leave this ride?",
      message: `You are about to leave ${ride.pickup} → ${ride.destination}. You can rejoin only if seats are still available.`,
      confirmLabel: "Leave Ride",
      onConfirm: () => handleLeaveRide(ride._id),
    });
  };

  const closeRideModal = () => {
    if (confirmLoading) {
      return;
    }

    setPendingRideAction(null);
  };

  const confirmRideAction = async () => {
    if (!pendingRideAction) {
      return;
    }

    try {
      setConfirmLoading(true);
      await pendingRideAction.onConfirm();
      setPendingRideAction(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <h1>My Rides</h1>

      {loading && <LoadingSpinner label="Loading your rides..." />}
      {error && <p>{error}</p>}

      {!loading && !error && rides.length === 0 && (
        <EmptyState
          title="No rides yet"
          description="You have not joined any rides yet. Browse available rides to get started."
          action={
            <button type="button" onClick={() => navigate("/rides")}>
              Browse Rides
            </button>
          }
        />
      )}

      {rides.map((ride) => {
        const isDriver = ride.driverId.toString() === user.id.toString();
        const hasJoined = ride.riders.some(
          (riderId) => riderId.toString() === user.id.toString()
        );

        return (
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

            <div className="role-pill-row">
              <span className="role-pill">{isDriver ? "Driver" : "Rider"}</span>
            </div>

            <p className="card-meta">Vehicle: {ride.vehicleDetails}</p>

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

            {ride.status === "completed" && (
              <p className="card-helper-text">
                Completed rides are locked and cannot be left.
              </p>
            )}

            {!isDriver && hasJoined && ride.status !== "completed" && (
              <button className="danger-btn" onClick={() => openLeaveModal(ride)} disabled={leavingRideId === ride._id || confirmLoading}>
                Leave Ride
              </button>
            )}
          </div>
        );
      })}

      <ConfirmationModal
        isOpen={Boolean(pendingRideAction)}
        title={pendingRideAction?.title || "Confirm action"}
        message={pendingRideAction?.message || "Are you sure you want to continue?"}
        confirmLabel={pendingRideAction?.confirmLabel || "Confirm"}
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={confirmRideAction}
        onCancel={closeRideModal}
      />
    </div>
  );
}

export default MyRides;