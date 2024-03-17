const { Schema, model } = require("mongoose");

// schema
const bookSchema = new Schema(
  {
    imageURL: {
      type: String,
      required: [true, "Image URL field is required"],
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Title field is required"],
      unique: true,
      trim: true,
    },

    subtitle: { type: String, trim: true },

    author: {
      type: String,
      trim: true,
      required: [true, "Author field is required"],
    },

    price: {
      type: Number,
      required: [true, "Price field is required"],
    },

    availableQuantity: {
      type: Number,
      required: [true, "Available quantity field is required"],
    },

    description: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      required: [true, "Publisher field is required"],
    },

    publicationDate: {
      type: String,
      required: [true, "Publication date field is required"],
    },

    weight: {
      type: Number,
      required: [true, "Weight field is required"],
    },

    pagesQuantity: {
      type: Number,
      required: [true, "Pages quantity field is required"],
    },

    dimensions: {
      type: String,
      required: [true, "Dimensions field is required"],
    },

    isbn: {
      type: String,
      required: [true, "ISBN field is required"],
      unique: true,
    },

    binding: {
      type: String,
      required: [true, "Binding field is required"],
    },

    category: {
      type: String,
      required: [true, "Category field is required"],
    },

    totalSales: {
      type: Number,
      required: [true, "Total sales is required"],
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.statics.isBookExist = async function (id) {
  const existingBook = await Book.findById(id);
  return existingBook;
};

// model
const Book = model("Book", bookSchema);

module.exports = {
  Book,
};
