const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    riders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    pickup: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    pickupLatLng: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },

    destinationLatLng: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },

    distance: {
      text: {
        type: String,
        default: "",
      },
      value: {
        type: Number,
        default: 0,
      },
    },

    duration: {
      text: {
        type: String,
        default: "",
      },
      value: {
        type: Number,
        default: 0,
      },
    },

    departureTime: {
      type: String,
      required: true,
    },

    vehicleDetails: {
      type: String,
      required: true,
    },

    maxSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    farePerStudent: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "full", "started", "completed", "cancelled"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);