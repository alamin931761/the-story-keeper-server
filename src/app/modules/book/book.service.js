const httpStatus = require("http-status");
const AppError = require("../../../error/appError");
const { Book } = require("./book.model");

const addBookIntoDB = async (payload) => {
  const result = await Book.create({ ...payload, totalSales: 0 });
  return result;
};

const getAllBooksFromDB = async (query) => {
  const queryObject = { ...query };

  //searching
  let searchTerm = "";
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm;
  }
  const bookSearchableFields = ["title", "author", "isbn"];
  const searchQuery = Book.find({
    $or: bookSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });

  // filtering
  const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
  excludeFields.forEach((element) => delete queryObject[element]);
  const filterQuery = searchQuery.find(queryObject);

  // sorting
  let sort = "-createdAt";
  if (query.sort) {
    sort = query.sort;
  }
  const sortQuery = filterQuery.sort(sort);

  // limiting
  let limit = 100;
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
  return fieldQuery;
};

const getSingleBookFromDB = async (id) => {
  const book = await Book.isBookExist(id);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found!");
  }
  return book;
};

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

const deleteBookFromDB = async (id) => {
  const book = await Book.isBookExist(id);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const result = await Book.deleteOne({ _id: id }, { new: true });
  console.log(result);
  return result;
};

const getRandomBooksFromDB = async (id, category) => {
  console.log(category);
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
