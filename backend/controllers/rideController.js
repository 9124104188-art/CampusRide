const Ride = require("../models/Ride");

const createRide = async (req, res) => {
  try {
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

    res.status(201).json({
      message: "Ride created successfully",
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const availableRides = async (req, res) => {
  try{
    const rides = await Ride.find({status: "available"});
    res.status(200).json({
      message: "Available rides fetched successfully",
      rides,
    });
  }
  catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
}

const joinRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const userId = req.user.id;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (ride.driverId.toString() === userId) {
      return res.status(400).json({
        message: "Driver cannot join own ride",
      });
    }

    if (ride.riders.includes(userId)) {
      return res.status(400).json({
        message: "You have already joined this ride",
      });
    }

    if (ride.riders.length >= ride.maxSeats) {
      return res.status(400).json({
        message: "Ride is full",
      });
    }

    ride.riders.push(userId);

    if (ride.riders.length === ride.maxSeats) {
      ride.status = "full";
    }

    await ride.save();

    res.status(200).json({
      message: "Ride joined successfully",
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyRides = async (req, res) => {
  try {
    const userId = req.user.id;

    const rides = await Ride.find({
      $or: [
        { driverId: userId },
        { riders: userId },
      ],
    });

    res.status(200).json({
      message: "My rides fetched successfully",
      rides,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const leaveRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const userId = req.user.id;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (!ride.riders.includes(userId)) {
      return res.status(400).json({
        message: "You have not joined this ride",
      });
    }

    ride.riders = ride.riders.filter(
      (riderId) => riderId.toString() !== userId
    );

    if (ride.status === "full") {
      ride.status = "available";
    }

    await ride.save();

    res.status(200).json({
      message: "Ride left successfully",
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCreatedRides = async (req, res) => {
  try {
    const userId = req.user.id;

    const rides = await Ride.find({ driverId: userId }).populate("riders", "name email phone");

    res.status(200).json({
      message: "Created rides fetched successfully",
      rides,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const userId = req.user.id;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (ride.driverId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this ride",
      });
    }

    await Ride.findByIdAndDelete(rideId);

    res.status(200).json({
      message: "Ride deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const userId = req.user.id;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (ride.driverId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to update this ride",
      });
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Ride updated successfully",
      ride: updatedRide,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateRideStatus = async (req, res) => {
  try {
    const rideId = req.params.id;
    const userId = req.user.id;
    const { status } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (ride.driverId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to update this ride status",
      });
    }

    if (!["started", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    ride.status = status;
    await ride.save();

    res.status(200).json({
      message: "Ride status updated successfully",
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRideHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const rides = await Ride.find({
      $and: [
        {
          $or: [
            { driverId: userId },
            { riders: userId },
          ],
        },
        {
          status: { $in: ["completed", "cancelled"] },
        },
      ],
    });

    res.status(200).json({
      message: "Ride history fetched successfully",
      rides,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
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
  getRideHistory
};