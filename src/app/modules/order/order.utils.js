const { Book } = require("../book/book.model");
const Order = require("./order.model");

// find last Order Id
const findLastOrderId = async () => {
  const lastOrderId = await Order.findOne(
    { total: { $ne: 0 } },
    { orderId: 1, _id: 0 }
  ).sort({
    createdAt: -1,
  });

  return lastOrderId?.orderId ? lastOrderId.orderId : "0";
};

// generate Order ID
const generateOrderId = async () => {
  const lastOrderId = await findLastOrderId(); // string

  const orderId = (Number(lastOrderId) + 1).toString().padStart(4, "0");
  return orderId;
};

// fetch order with details
const fetchOrdersWithDetails = async (orders) => {
  const ordersArray = [];

  for (const order of orders) {
    const books = order.books; // [{},{},{}] [{},{}],...

    const bookDetails = [];
    for (const book of books) {
      // book --> {} {} ..
      const bookId = book.bookId;
      const quantity = book.quantity;

      // find book
      const findBook = await Book.findById(bookId).select(
        "title price imageURL -_id"
      );
      const details = { ...findBook.toObject(), quantity };
      bookDetails.push(details);
    }
    const bookArray = { ...order.toObject(), books: bookDetails };
    ordersArray.push(bookArray);
  }

  return ordersArray;
};

module.exports = { generateOrderId, fetchOrdersWithDetails };
