const { z } = require("zod");

const addReviewValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({ message: "Invalid email address" }),

    rating: z
      .number({
        required_error: "Rating is required",
        invalid_type_error: "Rating must be a number",
      })
      .lte(5, { message: "Rating must be less than or equal to 5" })
      .gte(1, { message: "Rating must be greater than or equal to 1" }),

    reviewContent: z
      .string({
        required_error: "Review content is required",
        invalid_type_error: "Review content must be a string",
      })
      .min(5, { message: "Review content must be 5 or more characters long" })
      .trim(),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z
      .number({
        required_error: "Rating is required",
        invalid_type_error: "Rating must be a number",
      })
      .lte(5, { message: "Rating must be less than or equal to 5" })
      .gte(1, { message: "Rating must be greater than or equal to 1" })
      .optional(),

    reviewContent: z
      .string({
        required_error: "Review content is required",
        invalid_type_error: "Review content must be a string",
      })
      .min(5, { message: "Review content must be 5 or more characters long" })
      .trim()
      .optional(),
  }),
});

const reviewValidations = {
  addReviewValidationSchema,
  updateReviewValidationSchema,
};

module.exports = { reviewValidations };
