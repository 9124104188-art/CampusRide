const Ride = require("../models/Ride");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const createRide = async (req, res) => {
  const {
    pickup,
    destination,
    departureTime,
    vehicleDetails,
    maxSeats,
    farePerStudent,
  } = req.body;

  const ride = await Ride.create({
    driverId: req.user.id,
    pickup,
    destination,
    departureTime,
    vehicleDetails,
    maxSeats,
    farePerStudent,
  });

  return sendSuccess(res, 201, "Ride created successfully", { ride });
};

const availableRides = async (req, res) => {
  const rides = await Ride.find({ status: "available" });

  return sendSuccess(res, 200, "Available rides fetched successfully", {
    rides,
  });
};

const joinRide = async (req, res) => {
  const rideId = req.params.id;
  const userId = req.user.id;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (ride.status !== "available") {
    throw new ApiError(400, "Ride is not available for joining");
  }

  if (ride.driverId.toString() === userId) {
    throw new ApiError(400, "Driver cannot join own ride");
  }

  if (ride.riders.some((riderId) => riderId.toString() === userId)) {
    throw new ApiError(400, "You have already joined this ride");
  }

  if (ride.riders.length >= ride.maxSeats) {
    throw new ApiError(400, "Ride is full");
  }

  ride.riders.push(userId);

  if (ride.riders.length === ride.maxSeats) {
    ride.status = "full";
  }

  await ride.save();

  return sendSuccess(res, 200, "Ride joined successfully", { ride });
};

const getMyRides = async (req, res) => {
  const userId = req.user.id;

  const rides = await Ride.find({
    $or: [{ driverId: userId }, { riders: userId }],
  });

  return sendSuccess(res, 200, "My rides fetched successfully", { rides });
};

const leaveRide = async (req, res) => {
  const rideId = req.params.id;
  const userId = req.user.id;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (!ride.riders.some((riderId) => riderId.toString() === userId)) {
    throw new ApiError(400, "You have not joined this ride");
  }

  ride.riders = ride.riders.filter(
    (riderId) => riderId.toString() !== userId
  );

  if (ride.status === "full") {
    ride.status = "available";
  }

  await ride.save();

  return sendSuccess(res, 200, "Ride left successfully", { ride });
};

const getCreatedRides = async (req, res) => {
  const userId = req.user.id;

  const rides = await Ride.find({ driverId: userId }).populate(
    "riders",
    "name email phone"
  );

  return sendSuccess(res, 200, "Created rides fetched successfully", {
    rides,
  });
};

const deleteRide = async (req, res) => {
  const rideId = req.params.id;
  const userId = req.user.id;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (ride.driverId.toString() !== userId) {
    throw new ApiError(403, "You are not allowed to delete this ride");
  }

  await Ride.findByIdAndDelete(rideId);

  return sendSuccess(res, 200, "Ride deleted successfully");
};

const updateRide = async (req, res) => {
  const rideId = req.params.id;
  const userId = req.user.id;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (ride.driverId.toString() !== userId) {
    throw new ApiError(403, "You are not allowed to update this ride");
  }

  const allowedFields = [
    "pickup",
    "destination",
    "departureTime",
    "vehicleDetails",
    "maxSeats",
    "farePerStudent",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const updatedRide = await Ride.findByIdAndUpdate(rideId, updates, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 200, "Ride updated successfully", {
    ride: updatedRide,
  });
};

const updateRideStatus = async (req, res) => {
  const rideId = req.params.id;
  const userId = req.user.id;
  const { status } = req.body;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (ride.driverId.toString() !== userId) {
    throw new ApiError(
      403,
      "You are not allowed to update this ride status"
    );
  }

  if (!["started", "completed", "cancelled"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  ride.status = status;
  await ride.save();

  return sendSuccess(res, 200, "Ride status updated successfully", {
    ride,
  });
};

const getRideHistory = async (req, res) => {
  const userId = req.user.id;

  const rides = await Ride.find({
    $and: [
      {
        $or: [{ driverId: userId }, { riders: userId }],
      },
      {
        status: { $in: ["completed", "cancelled"] },
      },
    ],
  });

  return sendSuccess(res, 200, "Ride history fetched successfully", {
    rides,
  });
};

module.exports = {
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
};