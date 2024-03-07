const handleValidationError = (error) => {
  const errorSources = Object.values(error.errors).map((val) => {
    return {
      path: val?.path,
      message: val.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

module.exports = handleValidationError;
