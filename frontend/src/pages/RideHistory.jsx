/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function RideHistory() {
  const [rides, setRides] = useState([]);
  const fetchHistory = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/rides/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRides(res.data.rides);
  } catch (error) {
    alert(error.response?.data?.message || "Failed to fetch ride history");
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
        {rides.length === 0 && <p>No ride history found.</p>}

{rides.map((ride) => (
  <div className="card" key={ride._id}>
    <h3>{ride.pickup} → {ride.destination}</h3>

    <p>Departure: {ride.departureTime}</p>
    <p>Vehicle: {ride.vehicleDetails}</p>
    <p>Fare: ₹{ride.farePerStudent}</p>
    <p>Status: {ride.status}</p>
    <p>Seats Filled: {ride.riders.length}/{ride.maxSeats}</p>
  </div>
))}
      </div>
    </>
  );
}

export default RideHistory;