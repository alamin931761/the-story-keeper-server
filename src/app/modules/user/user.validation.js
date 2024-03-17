const { z } = require("zod");

const createUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Invalid email address" }),

    role: z.string().optional(),

    name: z.string({
      required_error: "Email is required",
      invalid_type_error: "Name must be a string",
    }),

    address: z.string().trim().optional(),

    phoneNumber: z.string().trim().optional(),

    imageURL: z.string().trim().optional(),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    imageURL: z
      .string({
        required_error: "Image URL is required",
        invalid_type_error: "Image URL must be a string",
      })
      .trim(),

    phoneNumber: z
      .string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
      })
      .trim(),

    address: z
      .string({
        required_error: "Address is required",
        invalid_type_error: "Address must be a string",
      })
      .trim(),
  }),
});

const userValidations = {
  createUserValidationSchema,
  updateProfileValidationSchema,
};

module.exports = {
  userValidations,
};
