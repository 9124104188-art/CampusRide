import { useState } from "react";
import api from "../api/axios";
import GoogleMapsRidePicker from "../components/GoogleMapsRidePicker";
import Navbar from "../components/NavBar";
import { useToast } from "../context/useToast";

function CreateRide() {
  const { showToast } = useToast();
  const [pickerResetKey, setPickerResetKey] = useState(0);
  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
    pickupLatLng: null,
    destinationLatLng: null,
    distance: "",
    duration: "",
    departureTime: "",
    vehicleDetails: "",
    maxSeats: "",
    farePerStudent: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRouteChange = (updates) => {
    setFormData((current) => ({
      ...current,
      ...updates,
    }));
  };

  const handleCreateRide = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/rides", formData);
      showToast(res.data.message, "success");

      setFormData({
        pickup: "",
        destination: "",
        pickupLatLng: null,
        destinationLatLng: null,
        distance: "",
        duration: "",
        departureTime: "",
        vehicleDetails: "",
        maxSeats: "",
        farePerStudent: "",
      });
      setPickerResetKey((current) => current + 1);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create ride";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <Navbar />

      <div className="page-header">
        <h1>Create Ride</h1>
        <p>Publish a ride for your campus community.</p>
      </div>

      {error && <p>{error}</p>}

      <form className="ride-form" onSubmit={handleCreateRide}>
        <GoogleMapsRidePicker
          key={pickerResetKey}
          value={formData}
          onChange={handleRouteChange}
        />

        <label className="field">
          <span>Departure Time</span>
          <input
            name="departureTime"
            placeholder="YYYY-MM-DD HH:MM"
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <span>Vehicle Details</span>
          <input
            name="vehicleDetails"
            placeholder="Vehicle model and color"
            onChange={handleChange}
          />
        </label>
        <div className="form-grid form-grid-2">
          <label className="field">
            <span>Max Seats</span>
            <input name="maxSeats" placeholder="Seats available" onChange={handleChange} />
          </label>
          <label className="field">
            <span>Fare Per Student</span>
            <input
              name="farePerStudent"
              placeholder="Fare in INR"
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Ride"}
        </button>
      </form>
    </div>
  );
}

export default CreateRide;