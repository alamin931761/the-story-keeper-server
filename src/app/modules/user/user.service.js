const config = require("../../../config");
const User = require("./user.model");
const { createToken } = require("./user.utils");

// create or login user
const createOrLoginUser = async (payload) => {
  const email = payload.email;
  const user = await User.findOneAndUpdate({ email }, payload, {
    upsert: true,
    new: true,
  });

  // create token and sent to the client
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return { accessToken };
};

// get single user
const getSingleUserFromDB = async (email) => {
  const result = await User.findOne(
    { email },
    { email: 1, name: 1, address: 1, phoneNumber: 1, role: 1, imageURL: 1 }
  );
  return result;
};

// get all users
const getAllUsersFromDB = async () => {
  const users = await User.find({}, { email: 1, role: 1 }).sort({ role: 1 });

  const count = await User.countDocuments(users);
  return { users, count };
};

// update profile
const updateProfileIntoDB = async (email, payload) => {
  const result = await User.findOneAndUpdate({ email }, payload, { new: true });
  return result;
};

const updateRoleIntoDB = async (email, role) => {
  const result = await User.findOneAndUpdate({ email }, role, { new: true });
  return result;
};

const UserServices = {
  createOrLoginUser,
  getSingleUserFromDB,
  getAllUsersFromDB,
  updateProfileIntoDB,
  updateRoleIntoDB,
};

module.exports = UserServices;
