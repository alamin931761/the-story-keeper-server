const User = require("../user/user.model");
const { Review } = require("./review.model");

// add review
const addReviewIntoDB = async (bookId, payload) => {
  const email = payload.email;
  const findUser = await User.findOne({ email }, { _id: 1 });
  const user = findUser._id;
  const review = { bookId, ...payload, user };
  const result = await Review.create(review);
  return result;
};

// Get all reviews for a specific book
const getAllReviewsFromDB = async (bookId) => {
  const result = await Review.find({ bookId })
    .populate({
      path: "user",
      select: "imageURL name email createdAt -_id",
    })
    .select("-updatedAt -__v")
    .sort("-createdAt");
  return result;
};

// update review
const updateReviewIntoDB = async (id, payload) => {
  const result = await Review.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// delete review
const deleteReviewFromDB = async (id) => {
  const result = await Review.findByIdAndDelete(id);
  return result;
};

const ReviewServices = {
  addReviewIntoDB,
  getAllReviewsFromDB,
  updateReviewIntoDB,
  deleteReviewFromDB,
};

module.exports = { ReviewServices };
