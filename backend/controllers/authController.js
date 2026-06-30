const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const registerUser = async (req, res) => {
  const { name, email, password, phone, college, department, year } =
    req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    college,
    department,
    year,
  });

  return sendSuccess(res, 201, "User registered successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      college: user.college,
      department: user.department,
      year: user.year,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return sendSuccess(res, 200, "Login successful", {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
};