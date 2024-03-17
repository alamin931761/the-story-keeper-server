const { z } = require("zod");

const addBookValidationSchema = z.object({
  body: z.object({
    imageURL: z
      .string({
        required_error: "Image URL field is required",
        invalid_type_error: "Image URL must be a string",
      })
      .trim(),

    title: z
      .string({
        required_error: "Title field is required",
        invalid_type_error: "Title must be a string",
      })
      .trim(),

    subtitle: z
      .string({
        invalid_type_error: "Subtitle must be a string",
      })
      .trim()
      .optional(),

    author: z
      .string({
        required_error: "Author field is required",
        invalid_type_error: "Author must be a string",
      })
      .trim(),

    price: z
      .number({
        required_error: "Price field is required",
        invalid_type_error: "Price must be a number",
      })
      .positive("Price must be greater than 0")
      .lte(2000, "Price must be less than or equal to 2000"),

    availableQuantity: z
      .number({
        required_error: "Available quantity field is required",
        invalid_type_error: "Available quantity must be a number",
      })
      .positive("Available quantity must be greater than 0"),

    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .trim()
      .optional(),

    publisher: z
      .string({
        required_error: "Publisher field is required",
        invalid_type_error: "Publisher must be a string",
      })
      .trim(),

    publicationDate: z.string({
      required_error: "Publication date field is required",
      invalid_type_error: "Publication date must be a string",
    }),

    weight: z
      .number({
        required_error: "Weight field is required",
        invalid_type_error: "Weight must be a number",
      })
      .positive("Weight must be greater than 0"),

    pagesQuantity: z
      .number({
        required_error: "Pages quantity field is required",
        invalid_type_error: "Pages quantity must be a number",
      })
      .positive("Pages quantity must be greater than 0"),

    dimensions: z.string({
      required_error: "Dimensions field is required",
      invalid_type_error: "Dimensions must be a string",
    }),

    isbn: z.string({
      required_error: "ISBN field is required",
      invalid_type_error: "ISBN must be a string",
    }),

    binding: z.string({
      required_error: "Binding field is required",
      invalid_type_error: "Binding must be a string",
    }),

    category: z.string({
      required_error: "Category field is required",
      invalid_type_error: "Category must be a string",
    }),
  }),
});

const updateBookValidationSchema = z.object({
  body: z.object({
    price: z
      .number({
        required_error: "Price field is required",
        invalid_type_error: "Price must be a number",
      })
      .positive("Price must be greater than 0")
      .lte(2000, "Price must be less than or equal to 2000"),

    availableQuantity: z
      .number({
        required_error: "Available quantity field is required",
        invalid_type_error: "Available quantity must be a number",
      })
      .positive("Available quantity must be greater than 0"),
  }),
});

const bookValidations = {
  addBookValidationSchema,
  updateBookValidationSchema,
};

module.exports = {
  bookValidations,
};
