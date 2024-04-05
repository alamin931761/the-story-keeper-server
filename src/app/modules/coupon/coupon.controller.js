const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const { CouponServices } = require("./coupon.service");

// add coupon
const addCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.addCouponIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon added successfully!",
    data: result,
  });
});

// get all coupons
const getAllCoupons = catchAsync(async (req, res) => {
  const result = await CouponServices.getAllCouponsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupons are retrieved successfully!",
    data: result,
  });
});

// get single coupon
const getSingleCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.getSingleCouponFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon is retrieved successfully!",
    data: result,
  });
});

// update coupon
const updateCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.updateCouponIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon has been successfully updated!",
    data: result,
  });
});

// delete coupon
const deleteCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.deleteCouponFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon has been successfully deleted!",
    data: result,
  });
});

// verify coupon
const verifyCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.verifyCouponFromDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon code applied successfully!",
    data: result,
  });
});

const CouponController = {
  addCoupon,
  updateCoupon,
  getAllCoupons,
  getSingleCoupon,
  deleteCoupon,
  verifyCoupon,
};

module.exports = { CouponController };
