import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AvailableRides from "./pages/AvailableRides";
import MyRides from "./pages/MyRides";
import CreateRide from "./pages/CreateRide";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import CreatedRides from "./pages/CreatedRides";
import RideHistory from "./pages/RideHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
     
      <Route path="/dashboard" element={<ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>} />
       <Route
    path="/rides"
    element={
      <ProtectedRoute>
        <AvailableRides />
      </ProtectedRoute>
    }
  />
  <Route
  path="/history"
  element={
    <ProtectedRoute>
      <RideHistory />
    </ProtectedRoute>
  }
/>

  <Route
    path="/my-rides"
    element={
      <ProtectedRoute>
        <MyRides />
      </ProtectedRoute>
    }
  />

  <Route
    path="/create-ride"
    element={
      <ProtectedRoute>
        <CreateRide />
      </ProtectedRoute>
    }
  />
  <Route
  path="/created-rides"
  element={
    <ProtectedRoute>
      <CreatedRides />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;