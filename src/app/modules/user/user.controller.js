const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const UserServices = require("./user.service");

// create user or update user
const createOrUpdateUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const data = req.body;

  let message;
  if (Object.keys(data).length > 1) {
    message = "Users data updated successfully";
  }

  if (data?.role === "admin") {
    message = "Successfully made an Admin";
  } else {
    message = "Successfully remove an admin";
  }

  const result = await UserServices.createOrUpdateUserIntoDB(email, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: message,
    data: result,
  });
});

// remove user
const removeUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.removeUserFromDB(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

const UserControllers = {
  createOrUpdateUser,
  removeUser,
};

module.exports = UserControllers;
