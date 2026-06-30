const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/apiResponse");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return sendError(res, 401, "Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
    };
    next();
  } catch (error) {
    return sendError(res, 401, "Not authorized, token failed");
  }
};

module.exports = { protect };