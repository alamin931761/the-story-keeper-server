const httpStatus = require("http-status");
const AppError = require("../../../error/appError");
const { Book } = require("./book.model");

// add book
const addBookIntoDB = async (payload) => {
  const result = await Book.create({ ...payload, totalSales: 0 });
  return result;
};

// get all books
const getAllBooksFromDB = async (query) => {
  const queryObject = { ...query };

  // price range
  let minimumPrice = 0;
  let maximumPrice = 2000;
  if (query.minimumValue) {
    minimumPrice = Number(query.minimumValue);
  }

  if (query?.maximumValue) {
    maximumPrice = Number(query.maximumValue);
  }

  const booksInPriceRange = Book.find({
    price: { $gte: minimumPrice, $lte: maximumPrice },
  });

  //searching
  let searchTerm = "";
  if (query.searchTerm) {
    searchTerm = query.searchTerm;
  }
  const bookSearchableFields = ["title", "author", "isbn"];
  const searchQuery = booksInPriceRange.find({
    $or: bookSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });

  // filtering
  const excludeFields = [
    "searchTerm",
    "sort",
    "limit",
    "page",
    "fields",
    "minimumValue",
    "maximumValue",
  ];
  excludeFields.forEach((element) => delete queryObject[element]);
  const filterQuery = searchQuery.find(queryObject);
  // count
  const count = await Book.countDocuments(filterQuery);

  // sorting
  let sort = "availableQuantity";
  if (query.sort) {
    sort = query.sort;
  }
  const sortQuery = filterQuery.sort(sort);

  // limiting
  let limit = 3;
  let page = 1;
  let skip = 0;
  if (query.limit) {
    limit = Number(query.limit);
  }
  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }
  const paginateQuery = sortQuery.skip(skip);
  const limitQuery = paginateQuery.limit(limit);

  // field limiting
  let fields = "-__v";
  if (query.fields) {
    fields = query.fields.split(",").join(" ");
  }
  const fieldQuery = await limitQuery.select(fields);

  return { fieldQuery, count };
};

// get single book
const getSingleBookFromDB = async (id) => {
  const book = await Book.isBookExist(id);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found!");
  }
  return book;
};

// update book
const updateBookIntoDB = async (id, payload) => {
  const book = await Book.isBookExist(id);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const result = await Book.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

// delete book
const deleteBookFromDB = async (id) => {
  const book = await Book.isBookExist(id);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const result = await Book.deleteOne({ _id: id }, { new: true });
  return result;
};

// get random books
const getRandomBooksFromDB = async (id, category) => {
  const book = await Book.isBookExist(id);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const sortFields = [
    "price",
    "-price",
    "title",
    "-title",
    "author",
    "-author",
    "createdAt",
    "-createdAt",
    "updatedAt",
    "-updatedAt",
  ];

  const getRandomSortField = Math.floor(Math.random() * sortFields.length);

  const result = await Book.find({ category: category, _id: { $ne: id } })
    .sort(sortFields[getRandomSortField])
    .select("imageURL title author price")
    .limit(3);
  return result;
};

const BookServices = {
  addBookIntoDB,
  getAllBooksFromDB,
  getSingleBookFromDB,
  updateBookIntoDB,
  deleteBookFromDB,
  getRandomBooksFromDB,
};

module.exports = BookServices;
