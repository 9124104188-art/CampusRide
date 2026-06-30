const { sendError } = require("../utils/apiResponse");

const notFound = (req, res) => {
  return sendError(res, 404, `Route not found: ${req.originalUrl}`);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";
  let errors = err.errors || null;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  if (statusCode === 500 && process.env.NODE_ENV !== "development") {
    message = "Server error";
  }

  return sendError(res, statusCode, message, errors);
};

module.exports = {
  notFound,
  errorHandler,
};