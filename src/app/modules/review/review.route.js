const { Router } = require("express");
const { validateRequest } = require("../../middlewares/validateRequest");
const { reviewValidations } = require("./review.validation");
const { ReviewController } = require("./review.controller");
const auth = require("../../middlewares/auth");
const USER_ROLE = require("../user/user.constant");

const router = Router();

// add review
router.post(
  "/add-review/:bookId",
  auth(USER_ROLE.user),
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
  auth(USER_ROLE.user),
  validateRequest(reviewValidations.updateReviewValidationSchema),
  ReviewController.updateReview
);

// delete review
router.delete("/:id", auth(USER_ROLE.user), ReviewController.deleteReview);

const ReviewRoutes = router;

module.exports = { ReviewRoutes };
