const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const UserServices = require("./user.service");

// create user or login user
const createOrLoginUser = catchAsync(async (req, res) => {
  const result = await UserServices.createOrLoginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Log in successfully",
    data: result,
  });
});

// get single user
const getSingleUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.getSingleUserFromDB(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

// get all users
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users are retrieved successfully",
    data: result,
  });
});

// update profile
const updateProfile = catchAsync(async (req, res) => {
  const result = await UserServices.updateProfileIntoDB(
    req.params.email,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const updateRole = catchAsync(async (req, res) => {
  const result = await UserServices.updateRoleIntoDB(
    req.params.email,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role updated successfully",
    data: result,
  });
});

const UserControllers = {
  createOrLoginUser,
  getSingleUser,
  getAllUsers,
  updateProfile,
  updateRole,
};

module.exports = UserControllers;
