const { Schema, model } = require("mongoose");

// schema
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  orders: {
    type: Schema.Types.ObjectId,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const User = model("User", userSchema);

module.exports = User;
