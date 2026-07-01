/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmationModal from "../components/ConfirmationModal";
import Navbar from "../components/NavBar";
import { useToast } from "../context/useToast";

function CreatedRides() {
  const navigate = useNavigate();
  const { showToast } = useToast();
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
  const [pendingRideAction, setPendingRideAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
      setActionLoading(true);
      const res = await api.put(`/rides/${rideId}`, editData);
      showToast(res.data.message, "success");
      setEditingRideId(null);
      await fetchCreatedRides();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update ride", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRide = async (rideId) => {
    try {
      setActionLoading(true);
      const res = await api.delete(`/rides/${rideId}`);
      showToast(res.data.message, "success");
      setRides(rides.filter((ride) => ride._id !== rideId));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete ride", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (rideId, status) => {
    try {
      setActionLoading(true);
      const res = await api.put(`/rides/${rideId}/status`, { status });
      showToast(res.data.message, "success");
      await fetchCreatedRides();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatedRides();
  }, []);

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

  const openDeleteModal = (ride) => {
    setPendingRideAction({
      title: "Delete ride?",
      message: `This will permanently remove ${ride.pickup} → ${ride.destination} from your created rides.`,
      confirmLabel: "Delete Ride",
      onConfirm: () => handleDeleteRide(ride._id),
    });
  };

  const openStatusModal = (ride, status) => {
    const nextStatusLabel = status === "started" ? "start" : "complete";

    setPendingRideAction({
      title: `Mark ride as ${nextStatusLabel}?`,
      message: `This will mark ${ride.pickup} → ${ride.destination} as ${status}.`,
      confirmLabel: `Mark as ${status}`,
      onConfirm: () => handleStatusChange(ride._id, status),
    });
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Created Rides</h1>

        {loading && <LoadingSpinner label="Loading created rides..." />}
        {error && <p>{error}</p>}

        {rides.length === 0 && !loading && (
          <EmptyState
            title="No created rides yet"
            description="Create your first ride to start receiving passengers from campus."
            action={
              <button type="button" onClick={() => navigate("/create-ride")}>
                Create Ride
              </button>
            }
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

            {ride.status === "started" && (
              <p className="card-helper-text">
                This ride has started. Editing is locked.
              </p>
            )}

            {ride.status === "completed" && (
              <p className="card-helper-text">
                This ride is completed and can no longer be edited or deleted.
              </p>
            )}

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

                <button onClick={() => handleUpdateRide(ride._id)} disabled={actionLoading || confirmLoading}>
                  {actionLoading ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditingRideId(null)} disabled={actionLoading || confirmLoading}>
                  Cancel
                </button>
              </div>
            ) : (
              !["started", "completed"].includes(ride.status) && (
                <>
                  <button className="secondary-btn" onClick={() => startEdit(ride)} disabled={actionLoading || confirmLoading}>
                    Edit Ride
                  </button>
                  <button className="danger-btn" onClick={() => openDeleteModal(ride)} disabled={actionLoading || confirmLoading}>
                    Delete Ride
                  </button>
                </>
              )
            )}

            {ride.status === "available" && (
              <button className="primary-btn" onClick={() => openStatusModal(ride, "started")} disabled={actionLoading || confirmLoading}>
                Start Ride
              </button>
            )}

            {ride.status === "started" && (
              <button className="primary-btn" onClick={() => openStatusModal(ride, "completed")} disabled={actionLoading || confirmLoading}>
                Complete Ride
              </button>
            )}
          </div>
        ))}

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
    </>
  );
}

export default CreatedRides;