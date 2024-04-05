const { Router } = require("express");
const { validateRequest } = require("../../middlewares/validateRequest");
const { CouponValidations } = require("./coupon.validation");
const { CouponController } = require("./coupon.controller");

const router = Router();

// add coupon
router.post(
  "/add-coupon",
  validateRequest(CouponValidations.addCouponValidationSchema),
  CouponController.addCoupon
);

// get all coupons
router.get("/", CouponController.getAllCoupons);

//get single coupon
router.get("/:id", CouponController.getSingleCoupon);

// update coupon
router.patch(
  "/:id",
  validateRequest(CouponValidations.updateCouponValidationSchema),
  CouponController.updateCoupon
);

// delete coupon
router.delete("/:id", CouponController.deleteCoupon);

// verify coupon
router.post("/verify-coupon", CouponController.verifyCoupon);

const CouponRoutes = router;

module.exports = { CouponRoutes };
