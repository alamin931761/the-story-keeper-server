const jwt = require("jsonwebtoken");

// create token
const createToken = (jwtPayload, secret, expiresIn) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

// verify token
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = { createToken, verifyToken };
