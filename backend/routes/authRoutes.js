const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const validate = require("../middleware/validateMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validators/authValidators");

router.post(
  "/register",
  registerValidation,
  validate,
  asyncHandler(registerUser)
);
router.post("/login", loginValidation, validate, asyncHandler(loginUser));

module.exports = router;