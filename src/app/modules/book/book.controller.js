const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const BookServices = require("./book.service");

// add book
const addBook = catchAsync(async (req, res) => {
  const result = await BookServices.addBookIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book added successfully!",
    data: result,
  });
});

// get all books
const getAllBooks = catchAsync(async (req, res) => {
  const result = await BookServices.getAllBooksFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books are retrieved successfully!",
    data: result,
  });
});

// get single book
const getSingleBook = catchAsync(async (req, res) => {
  const result = await BookServices.getSingleBookFromDB(
    req.params.id,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "The Book is retrieved successfully",
    data: result,
  });
});

// update book
const updateBook = catchAsync(async (req, res) => {
  const result = await BookServices.updateBookIntoDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book updated successfully!",
    data: result,
  });
});

// delete book
const deleteBook = catchAsync(async (req, res) => {
  const result = await BookServices.deleteBookFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book deleted successfully!",
    data: result,
  });
});

// get random books
const getRandomBooks = catchAsync(async (req, res) => {
  const result = await BookServices.getRandomBooksFromDB(
    req.params.id,
    req.query.category
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books are retrieved successfully!",
    data: result,
  });
});

const BookControllers = {
  addBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  getRandomBooks,
};

module.exports = {
  BookControllers,
};
