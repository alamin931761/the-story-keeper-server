const { Schema, model } = require("mongoose");

// schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
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
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
