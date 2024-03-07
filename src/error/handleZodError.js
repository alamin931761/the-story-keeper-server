const handleZodError = (error) => {
  const errorSources = error.issues.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

module.exports = handleZodError;
