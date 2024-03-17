const { Router } = require("express");
const { bookValidations } = require("./book.validation");
const { validateRequest } = require("../../middlewares/validateRequest");
const { BookControllers } = require("./book.controller");

const router = Router();

// add book
router.post(
  "/add-book",
  validateRequest(bookValidations.addBookValidationSchema),
  BookControllers.addBook
);

// get all books
router.get("/", BookControllers.getAllBooks);

// get single books
router.get("/:id", BookControllers.getSingleBook);

// update book
router.patch(
  "/:id",
  validateRequest(bookValidations.updateBookValidationSchema),
  BookControllers.updateBook
);

// delete book
router.delete("/:id", BookControllers.deleteBook);

// get random books
router.get("/random-books/:id", BookControllers.getRandomBooks);

const BookRoutes = router;

module.exports = {
  BookRoutes,
};
