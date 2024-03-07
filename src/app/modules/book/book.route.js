const { Router } = require("express");
const { bookValidations } = require("./book.validation");
const { validateRequest } = require("../../middlewares/validateRequest");
const { BookControllers } = require("./book.controller");

const router = Router();

// add book
router.post(
  "/add-book",
  validateRequest(bookValidations.AddBookValidationSchema),
  BookControllers.addBook
);

router.get("/", BookControllers.getAllBooks);

router.get("/:id", BookControllers.getSingleBook);

router.patch("/:id", BookControllers.updateBook);

router.delete("/:id", BookControllers.deleteBook);

router.get("/random/:id", BookControllers.getRandomBooks);

const BookRoutes = router;

module.exports = {
  BookRoutes,
};
