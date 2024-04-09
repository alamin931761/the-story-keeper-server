const { Schema, model } = require("mongoose");

const booksSchema = new Schema({
  bookId: {
    type: String,
    required: [true, "Book Id is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Book quantity is required"],
  },
});

const OrderSchema = new Schema(
  {
    books: {
      type: [booksSchema],
      required: [true, "Books is required"],
    },

    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
    },

    deliveryCharge: {
      type: Number,
      required: [true, "Delivery charge is required"],
    },

    discount: {
      type: Number,
      required: [true, "Discount is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
    },

    name: {
      type: String,
      required: [true, "Name is required"],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },

    tax: {
      type: Number,
      required: [true, "Tax is required"],
    },

    transactionId: {
      type: String,
      required: [true, "Transaction Id is required"],
    },

    total: {
      type: Number,
      required: [true, "Total is required"],
    },

    status: {
      type: String,
      default: "pending",
    },
    orderId: {
      type: String,
      required: [true, "Order Id is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// model
const Order = model("Order", OrderSchema);

module.exports = Order;
