const { Router } = require("express");
const { bookValidations } = require("./book.validation");
const { validateRequest } = require("../../middlewares/validateRequest");
const { BookControllers } = require("./book.controller");
const auth = require("../../middlewares/auth");
const USER_ROLE = require("../user/user.constant");

const router = Router();

// add book
router.post(
  "/add-book",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
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
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(bookValidations.updateBookValidationSchema),
  BookControllers.updateBook
);

// delete book
router.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  BookControllers.deleteBook
);

// get random books
router.get("/random-books/:id", BookControllers.getRandomBooks);

const BookRoutes = router;

module.exports = {
  BookRoutes,
};
