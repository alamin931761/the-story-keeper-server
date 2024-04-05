const { Schema, model } = require("mongoose");

// schema
const bookSchema = new Schema(
  {
    imageURL: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },

    subtitle: { type: String, trim: true },

    author: {
      type: String,
      trim: true,
      required: [true, "Author is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    availableQuantity: {
      type: Number,
      required: [true, "Available quantity is required"],
    },

    description: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      required: [true, "Publisher is required"],
    },

    publicationDate: {
      type: String,
      required: [true, "Publication date is required"],
    },

    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },

    pagesQuantity: {
      type: Number,
      required: [true, "Pages quantity is required"],
    },

    dimensions: {
      type: String,
      required: [true, "Dimensions is required"],
    },

    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
    },

    binding: {
      type: String,
      required: [true, "Binding is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
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
