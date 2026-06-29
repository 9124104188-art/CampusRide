const express = require("express");
const router = express.Router();

const{protect} = require("../middleware/authMiddleware");
const { createRide, availableRides, joinRide, getMyRides , leaveRide, getCreatedRides, deleteRide, updateRide, updateRideStatus, getRideHistory} = require("../controllers/rideController");

router.post("/", protect, createRide);
router.get("/", protect, availableRides);
router.get("/created", protect, getCreatedRides);
router.get("/myrides", protect, getMyRides);
router.get("/history", protect, getRideHistory);
router.post("/:id/join", protect, joinRide);
router.get("/myrides", protect, getMyRides);
router.post("/:id/leave", protect, leaveRide);
router.put("/:id/status", protect, updateRideStatus);
router.put("/:id", protect, updateRide);
router.delete("/:id", protect, deleteRide);
module.exports = router;