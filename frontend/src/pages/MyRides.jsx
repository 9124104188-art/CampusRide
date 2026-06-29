/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";

function MyRides() {
  const [rides, setRides] = useState([]);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const fetchMyRides = async () => {
    try {
      
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/rides/myrides", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRides(res.data.rides);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch my rides");
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  const handleLeaveRide = async (rideId) => {
    const confirmLeave = window.confirm("Are you sure you want to leave this ride?");

if (!confirmLeave) {
  return;
}
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `http://localhost:5000/api/rides/${rideId}/leave`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);
    fetchMyRides();
  } catch (error) {
    alert(error.response?.data?.message || "Failed to leave ride");
  }
};

  return (
    <div className="page">
      <Navbar />
      <h1>My Rides</h1>
      <p>
  Role: {rides.driverId === user.id ? "Driver" : "Rider"}
</p>

      {rides.map((ride) => (
        <div className="card" key={ride._id}>
          <h3>{ride.pickup} → {ride.destination}</h3>
          <p>Departure: {ride.departureTime}</p>
          <p>Vehicle: {ride.vehicleDetails}</p>
          <p>Status: {ride.status}</p>
          <p>Seats: {ride.riders.length}/{ride.maxSeats}</p>
          {ride.riders.map((id) => id.toString()).includes(user.id) && (
  <button onClick={() => handleLeaveRide(ride._id)}>
    Leave Ride
  </button>
)}
        </div>
      ))}
    </div>
  );
}

export default MyRides;