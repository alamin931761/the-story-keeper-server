const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const { OrderServices } = require("./order.service");

// create order
const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrderIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order has been created successfully",
    data: result,
  });
});

// Get all orders
const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.getAllOrdersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders are retrieved successfully!",
    data: result,
  });
});

// get user orders
const getUserOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.getUserOrdersFromDB(req.params.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders are retrieved successfully!",
    data: result,
  });
});

// update order status
const updateOrderStatus = catchAsync(async (req, res) => {
  const result = await OrderServices.updateOrderStatusIntoDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully!",
    data: result,
  });
});

const OrderController = {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
};

module.exports = { OrderController };
