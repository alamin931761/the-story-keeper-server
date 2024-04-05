const { z } = require("zod");

// add coupon validation schema
const addCouponValidationSchema = z.object({
  body: z.object({
    code: z
      .string({
        required_error: "Code is required",
        invalid_type_error: "Code must be a string",
      })
      .trim()
      .max(10, { message: "Code must be 10 or fewer characters long" }),

    discount: z
      .number({
        required_error: "Discount is required",
        invalid_type_error: "Discount must be a number",
      })
      .positive("Discount must be a positive number")
      .lte(100, { message: "Discount must be less than or equal to 100" }),

    expiryDate: z.string({
      required_error: "Expiry date is required",
      invalid_type_error: "Expiry date must be a string",
    }),

    limit: z
      .number({
        required_error: "Limit is required",
        invalid_type_error: "Limit must be a number",
      })
      .positive("Limit must be a positive number"),
  }),
});

// update coupon validation schema
const updateCouponValidationSchema = z.object({
  body: z.object({
    expiryDate: z
      .string({
        invalid_type_error: "Expiry date must be a string",
      })
      .optional(),

    limit: z
      .number({
        invalid_type_error: "Limit must be a number",
      })
      .positive("Limit must be a positive number")
      .optional(),
  }),
});

const CouponValidations = {
  addCouponValidationSchema,
  updateCouponValidationSchema,
};

module.exports = {
  CouponValidations,
};
