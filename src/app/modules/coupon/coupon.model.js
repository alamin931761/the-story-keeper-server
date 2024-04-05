const { Schema, model } = require("mongoose");

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Code is required"],
      trim: true,
      unique: true,
    },

    discount: {
      type: Number,
      required: [true, "Discount is required"],
    },

    expiryDate: {
      type: String,
      required: [true, "Expiry date is required"],
    },

    limit: {
      type: Number,
      required: [true, "Limit is required"],
    },

    totalUsage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.statics.isCouponExist = async function (id) {
  const existingCoupon = await Coupon.findById(id);
  return existingCoupon;
};

// model
const Coupon = model("Coupon", couponSchema);

module.exports = Coupon;
