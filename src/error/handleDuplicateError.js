const handleDuplicateError = (error) => {
  // extract value within double quotes using regex
  const match = error.message.match(/"([^"]*)"/);
  //   the extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  const errorSources = [
    {
      path: "",
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: `${extractedMessage} is already exists`,
    errorSources,
  };
};

module.exports = handleDuplicateError;
