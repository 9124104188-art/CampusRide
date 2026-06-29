/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";

function AvailableRides() {
  const [rides, setRides] = useState([]);
  const [pickupSearch, setPickupSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  

  const fetchRides = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/rides", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRides(res.data.rides);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch rides");
    }
  };

  const handleJoinRide = async (rideId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `http://localhost:5000/api/rides/${rideId}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);
    fetchRides();
  } catch (error) {
    alert(error.response?.data?.message || "Failed to join ride");
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

    {filteredRides.map((ride) => (
      <div className="card" key={ride._id}>
        <h3>{ride.pickup} → {ride.destination}</h3>

        <p>Departure: {ride.departureTime}</p>
        <p>Vehicle: {ride.vehicleDetails}</p>
        <p>Fare: ₹{ride.farePerStudent}</p>
        <p>Seats Left: {ride.maxSeats - ride.riders.length}</p>

        <button onClick={() => handleJoinRide(ride._id)}>
          Join Ride
        </button>
      </div>
    ))}
  </div>
</>
  );
}

export default AvailableRides;