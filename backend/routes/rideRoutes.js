const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createRide,
  availableRides,
  joinRide,
  getMyRides,
  leaveRide,
  getCreatedRides,
  deleteRide,
  updateRide,
  updateRideStatus,
  getRideHistory,
} = require("../controllers/rideController");
const validate = require("../middleware/validateMiddleware");
const {
  createRideValidation,
  updateRideValidation,
} = require("../middleware/validators/rideValidators");

router.post(
  "/",
  protect,
  createRideValidation,
  validate,
  asyncHandler(createRide)
);
router.get("/", protect, asyncHandler(availableRides));
router.get("/created", protect, asyncHandler(getCreatedRides));
router.get("/myrides", protect, asyncHandler(getMyRides));
router.get("/history", protect, asyncHandler(getRideHistory));
router.post("/:id/join", protect, asyncHandler(joinRide));
router.post("/:id/leave", protect, asyncHandler(leaveRide));
router.put("/:id/status", protect, asyncHandler(updateRideStatus));
router.put(
  "/:id",
  protect,
  updateRideValidation,
  validate,
  asyncHandler(updateRide)
);
router.delete("/:id", protect, asyncHandler(deleteRide));

module.exports = router;