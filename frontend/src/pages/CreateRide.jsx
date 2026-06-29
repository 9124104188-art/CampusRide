import { useState } from "react";
import axios from "axios";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateRide = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/rides",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create ride");
    }
  };

  return (
    <div className="page">
      <Navbar />

      <h1>Create Ride</h1>

      <form onSubmit={handleCreateRide}>
        <input name="pickup" placeholder="Pickup" onChange={handleChange} />
        <input name="destination" placeholder="Destination" onChange={handleChange} />
        <input name="departureTime" placeholder="Departure Time" onChange={handleChange} />
        <input name="vehicleDetails" placeholder="Vehicle Details" onChange={handleChange} />
        <input name="maxSeats" placeholder="Max Seats" onChange={handleChange} />
        <input name="farePerStudent" placeholder="Fare Per Student" onChange={handleChange} />

        <button type="submit">Create Ride</button>
      </form>
    </div>
  );
}

export default CreateRide;