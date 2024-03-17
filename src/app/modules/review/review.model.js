const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    bookId: {
      type: String,
      required: [true, "Book Id is required"],
    },

    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
    },

    reviewContent: {
      type: String,
      required: [true, "Review content is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = { Review };
