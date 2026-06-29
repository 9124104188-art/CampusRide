const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware"); 
const rideRoutes = require("./routes/rideRoutes");

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);

app.get("/",(req,res)=>{
    res.send("CampusRide Backend is running");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});