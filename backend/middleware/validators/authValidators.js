const { body } = require("express-validator");

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("college").trim().notEmpty().withMessage("College is required"),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("year")
    .isInt({ min: 1, max: 5 })
    .withMessage("Year must be between 1 and 5"),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
};