const httpStatus = require("http-status");
const AppError = require("../../../error/appError");
const Coupon = require("./coupon.model");
const isCouponExpired = require("./coupon.utils");

// add coupon
const addCouponIntoDB = async (payload) => {
  // check coupon code expired or not
  const expired = isCouponExpired(payload.expiryDate);
  if (expired) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The expiration date of the coupon must be in the future."
    );
  }

  const result = await Coupon.create(payload);
  return result;
};

// get all coupons
const getAllCouponsFromDB = async () => {
  const result = await Coupon.find({})
    .sort("-createdAt")
    .select("-createdAt -updatedAt -__v");
  return result;
};

// get single coupon
const getSingleCouponFromDB = async (id) => {
  // check coupon code exist or not
  const coupon = await Coupon.isCouponExist(id);
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found!");
  }
  return coupon;
};

// update coupon
const updateCouponIntoDB = async (id, payload) => {
  // check coupon code exist or not
  const coupon = await Coupon.isCouponExist(id);
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found!");
  }

  // check coupon code expired or not
  const expired = isCouponExpired(payload.expiryDate);
  if (expired) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The expiration date of the coupon must be in the future."
    );
  }

  const result = await Coupon.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// delete coupon
const deleteCouponFromDB = async (id) => {
  // check coupon code exist or not
  const coupon = await Coupon.isCouponExist(id);
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found!");
  }

  const result = await Coupon.findByIdAndDelete(id, { new: true });
  return result;
};

// verify coupon
const verifyCouponFromDB = async (code) => {
  // check coupon code exist or not
  const coupon = await Coupon.findOne(code);
  if (!coupon) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The coupon code you entered is not recognized. Please double-check the code and try again."
    );
  }

  // check coupon code expired or not
  const couponExpired = isCouponExpired(coupon.expiryDate);
  if (couponExpired) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This coupon has passed its expiration date and is no longer valid for use."
    );
  }

  // check if the coupon code exceeds its usage limit
  if (coupon.totalUsage === coupon.limit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Sorry, the coupon code you entered has reached its maximum usage limit."
    );
  }

  // increase totalUsage value
  if (coupon.totalUsage < coupon.limit) {
    const updateTotalUsage = await Coupon.updateOne(
      { _id: coupon._id },
      { $inc: { totalUsage: 1 } }
    );

    return { discount: coupon.discount };
  }
};

const CouponServices = {
  addCouponIntoDB,
  getAllCouponsFromDB,
  getSingleCouponFromDB,
  updateCouponIntoDB,
  deleteCouponFromDB,
  verifyCouponFromDB,
};

module.exports = { CouponServices };
