const { ZodError } = require("zod");
const handleZodError = require("../../error/handleZodError");
const handleValidationError = require("../../error/handleValidationError");
const handleCastError = require("../../error/CastError");
const handleDuplicateError = require("../../error/handleDuplicateError");
const AppError = require("../../error/appError");
const config = require("../../config");

const globalErrorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorSources = [
      {
        path: "",
        message: error?.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error?.message;
    errorSources = [
      {
        path: "",
        message: error?.message,
      },
    ];
  }

  // ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error,
    stack: config.node_env === "development" ? error.stack : null,
  });
};

module.exports = globalErrorHandler;
