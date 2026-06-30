import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/NavBar";

function CreateRide() {
  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
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

  const handleCreateRide = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/rides", formData);
      alert(res.data.message);

      setFormData({
        pickup: "",
        destination: "",
        departureTime: "",
        vehicleDetails: "",
        maxSeats: "",
        farePerStudent: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <h1>Create Ride</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleCreateRide}>
        <input name="pickup" placeholder="Pickup" onChange={handleChange} />
        <input
          name="destination"
          placeholder="Destination"
          onChange={handleChange}
        />
        <input
          name="departureTime"
          placeholder="Departure Time"
          onChange={handleChange}
        />
        <input
          name="vehicleDetails"
          placeholder="Vehicle Details"
          onChange={handleChange}
        />
        <input name="maxSeats" placeholder="Max Seats" onChange={handleChange} />
        <input
          name="farePerStudent"
          placeholder="Fare Per Student"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Ride"}
        </button>
      </form>
    </div>
  );
}

export default CreateRide;