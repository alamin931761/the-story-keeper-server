const User = require("./user.model");

// create or update user
const createOrUpdateUserIntoDB = async (email, payload) => {
  const user = await User.findOneAndUpdate({ email }, payload, {
    upsert: true,
    new: true,
  });
  return user;
};

// remove user
const removeUserFromDB = async (email) => {
  const result = await User.deleteOne({ email });
  return result;
};

const UserServices = {
  createOrUpdateUserIntoDB,
  removeUserFromDB,
};

module.exports = UserServices;
