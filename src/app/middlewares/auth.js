const httpStatus = require("http-status");
const config = require("../../config");
const AppError = require("../../error/appError");
const { verifyToken } = require("../modules/user/user.utils");
const catchAsync = require("../utils/catchAsync");

const auth = (...requiredRules) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // if the token is not sent from the client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // check if the token is valid
    const decoded = verifyToken(token, config.jwt_access_secret);
    const { email, role, iat, exp } = decoded;

    if (requiredRules && !requiredRules.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    req.user = decoded;
    next();
  });
};

module.exports = auth;
