const { body } = require("express-validator");

const createRideValidation = [
  body("pickup").trim().notEmpty().withMessage("Pickup is required"),
  body("destination").trim().notEmpty().withMessage("Destination is required"),
  body("pickupLatLng.lat")
    .optional({ nullable: true })
    .isFloat()
    .withMessage("Pickup latitude must be a valid number"),
  body("pickupLatLng.lng")
    .optional({ nullable: true })
    .isFloat()
    .withMessage("Pickup longitude must be a valid number"),
  body("destinationLatLng.lat")
    .optional({ nullable: true })
    .isFloat()
    .withMessage("Destination latitude must be a valid number"),
  body("destinationLatLng.lng")
    .optional({ nullable: true })
    .isFloat()
    .withMessage("Destination longitude must be a valid number"),
  body("distance.text")
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage("Distance text must be valid"),
  body("distance.value")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Distance value must be a valid number"),
  body("duration.text")
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage("Duration text must be valid"),
  body("duration.value")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Duration value must be a valid number"),
  body("departureTime")
    .trim()
    .notEmpty()
    .withMessage("Departure time is required"),
  body("vehicleDetails")
    .trim()
    .notEmpty()
    .withMessage("Vehicle details are required"),
  body("maxSeats")
    .isInt({ min: 1 })
    .withMessage("Max seats must be at least 1"),
  body("farePerStudent")
    .isFloat({ min: 0 })
    .withMessage("Fare must be 0 or greater"),
];

const updateRideValidation = [
  body("pickup")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Pickup cannot be empty"),
  body("destination")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Destination cannot be empty"),
  body("pickupLatLng.lat")
    .optional({ nullable: true })
    .isFloat()
    .withMessage("Pickup latitude must be a valid number"),
  body("pickupLatLng.lng")
    .optional({ nullable: true })
    .isFloat()
    .withMessage("Pickup longitude must be a valid number"),
  body("destinationLatLng.lat")
    .optional({ nullable: true })
    .isFloat()
    .withMessage("Destination latitude must be a valid number"),
  body("destinationLatLng.lng")
    .optional({ nullable: true })
    .isFloat()
    .withMessage("Destination longitude must be a valid number"),
  body("distance.text")
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage("Distance text must be valid"),
  body("distance.value")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Distance value must be a valid number"),
  body("duration.text")
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage("Duration text must be valid"),
  body("duration.value")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Duration value must be a valid number"),
  body("departureTime")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Departure time cannot be empty"),
  body("vehicleDetails")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Vehicle details cannot be empty"),
  body("maxSeats")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max seats must be at least 1"),
  body("farePerStudent")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Fare must be 0 or greater"),
];

module.exports = {
  createRideValidation,
  updateRideValidation,
};