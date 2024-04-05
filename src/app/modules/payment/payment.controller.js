const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const paymentService = require("./payment.service");
const sendResponse = require("../../utils/sendResponse");

const paymentController = catchAsync(async (req, res) => {
  const result = await paymentService(req.body.total);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client secret created successfully!",
    data: result,
  });
});

module.exports = paymentController;
