const { Router } = require("express");
const { validateRequest } = require("../../middlewares/validateRequest");
const { reviewValidations } = require("./review.validation");
const { ReviewController } = require("./review.controller");

const router = Router();

// add review
router.post(
  "/add-review/:bookId",
  validateRequest(reviewValidations.addReviewValidationSchema),
  ReviewController.addReview
);

// get single review
router.get("/single-review/:id", ReviewController.getSingleReview);

// Get all reviews for a specific book
router.get("/:bookId", ReviewController.getAllReviews);

// update review
router.patch(
  "/:id",
  validateRequest(reviewValidations.updateReviewValidationSchema),
  ReviewController.updateReview
);

// delete review
router.delete("/:id", ReviewController.deleteReview);

const ReviewRoutes = router;

module.exports = { ReviewRoutes };
