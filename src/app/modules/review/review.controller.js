const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const { ReviewServices } = require("./review.service");

// add review
const addReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.addReviewIntoDB(
    req.params.bookId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review added successfully!",
    data: result,
  });
});

// get single review
const getSingleReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.getSingleReviewFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review is retrieved successfully!",
    data: result,
  });
});

// Get all reviews for a specific book
const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllReviewsFromDB(req.params.bookId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews are retrieved successfully!",
    data: result,
  });
});

// update review
const updateReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.updateReviewIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully!",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.deleteReviewFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully!",
    data: result,
  });
});

const ReviewController = {
  addReview,
  getSingleReview,
  getAllReviews,
  updateReview,
  deleteReview,
};

module.exports = { ReviewController };
