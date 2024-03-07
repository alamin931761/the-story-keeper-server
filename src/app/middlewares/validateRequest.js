const catchAsync = require("../utils/catchAsync");

const validateRequest = (schema) => {
  return catchAsync(async (req, res, next) => {
    // validation check
    await schema.parseAsync({
      body: req.body,
    });
    next();
  });
};

module.exports = {
  validateRequest,
};
