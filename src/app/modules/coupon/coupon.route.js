const { Router } = require("express");
const { validateRequest } = require("../../middlewares/validateRequest");
const { CouponValidations } = require("./coupon.validation");
const { CouponController } = require("./coupon.controller");
const auth = require("../../middlewares/auth");
const USER_ROLE = require("../user/user.constant");

const router = Router();

// add coupon
router.post(
  "/add-coupon",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CouponValidations.addCouponValidationSchema),
  CouponController.addCoupon
);

// get all coupons
router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CouponController.getAllCoupons
);

//get single coupon
router.get(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CouponController.getSingleCoupon
);

// update coupon
router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CouponValidations.updateCouponValidationSchema),
  CouponController.updateCoupon
);

// delete coupon
router.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CouponController.deleteCoupon
);

// verify coupon
router.post("/verify-coupon", CouponController.verifyCoupon);

const CouponRoutes = router;

module.exports = { CouponRoutes };
