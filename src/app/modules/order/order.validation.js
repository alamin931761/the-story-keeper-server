const { z } = require("zod");

// create validation schema
const booksSchema = z.object({
  bookId: z.string({
    required_error: "Book Id is required",
    invalid_type_error: "Book Id must be a string",
  }),

  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .positive({ message: "Quantity must be a positive number" })
    .int({ message: "Quantity must be an integer" })
    .gt(0, { message: "Quantity must be greater than 0" }),
});

const createOrderValidationSchema = z.object({
  body: z.object({
    books: z.array(booksSchema),

    deliveryAddress: z.string({
      required_error: "Delivery address is required",
      invalid_type_error: "Delivery address must be a string",
    }),

    deliveryCharge: z
      .number({
        required_error: "Delivery charge is required",
        invalid_type_error: "Delivery charge must be a number",
      })
      .positive({ message: "Delivery charge must be a positive number" }),

    discount: z.number({
      required_error: "Delivery charge is required",
      invalid_type_error: "Delivery charge must be a number",
    }),

    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Invalid email address" }),

    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    }),

    phoneNumber: z
      .string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
      })
      .regex(
        /^0\d{10}$/,
        "Invalid phone number, please enter 11 digit phone number"
      ),

    tax: z
      .number({
        required_error: "Tax is required",
        invalid_type_error: "Tax must be a number",
      })
      .positive({ message: "Tax must be a positive number" }),

    transactionId: z.string({
      required_error: "Transaction Id is required",
      invalid_type_error: "Transaction Id must be a string",
    }),

    total: z
      .number({
        required_error: "Total is required",
        invalid_type_error: "Total must be a number",
      })
      .positive({ message: "Total must be a positive number" }),
  }),
});

const OrderValidations = {
  createOrderValidationSchema,
};

module.exports = {
  OrderValidations,
};
