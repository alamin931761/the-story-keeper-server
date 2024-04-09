const mongoose = require("mongoose");
const { Book } = require("../book/book.model");
const Order = require("./order.model");
const sendEmail = require("../../utils/sendEmail");
const { generateOrderId, fetchOrdersWithDetails } = require("./order.utils");

// create order
const createOrderIntoDB = async (payload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // update available books quantity and total sales
    const books = payload.books;
    for (const book of books) {
      // (transaction-1)
      const updated = await Book.updateOne(
        { _id: book.bookId },
        {
          $inc: {
            availableQuantity: -book.quantity,
            totalSales: book.quantity,
          },
        },
        { session }
      );
    }

    // generate order id
    const orderId = await generateOrderId();

    // create order (transaction -2)
    const createOrder = await Order.create([{ ...payload, orderId }], {
      session,
    });

    // send order confirmation mail
    // const subject = "Thank you for your purchase!";
    // const html = `
    // <p>Thank you for shopping with us today! Here are the details of your latest purchase:</p>

    // <ul>
    // <li>Order ID #: ${orderId}<li>
    // <li>Order Date: ${new Date().toLocaleDateString()}<li>
    // <li>Transaction ID: ${payload.transactionId}<li>
    // </ul>
    // `;

    // sendEmail(payload.email, subject, html);

    await session.commitTransaction();
    await session.endSession();

    return createOrder;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// get all orders
const getAllOrdersFromDB = async () => {
  const orders = await Order.find({})
    .sort("status -createdAt")
    .select("-updatedAt -__v");

  const result = await fetchOrdersWithDetails(orders);
  return result;
};

// get user orders
const getUserOrdersFromDB = async (email) => {
  const orders = await Order.find({ email })
    .sort("status -createdAt")
    .select("-updatedAt -__v");

  const result = await fetchOrdersWithDetails(orders);
  return result;
};

// update order status
const updateOrderStatusIntoDB = async (id) => {
  const result = await Order.findByIdAndUpdate(
    id,
    { status: "shipped" },
    { new: true }
  );
  return result;
};

const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getUserOrdersFromDB,
  updateOrderStatusIntoDB,
};

module.exports = { OrderServices };
