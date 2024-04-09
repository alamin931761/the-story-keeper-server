const express = require("express");
const { UserRoutes } = require("../modules/user/user.route");
const { BookRoutes } = require("../modules/book/book.route");
const { ReviewRoutes } = require("../modules/review/review.route");
const { CouponRoutes } = require("../modules/coupon/coupon.route");
const { PaymentRoute } = require("../modules/payment/payment.route");
const { OrderRoutes } = require("../modules/order/order.route");

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/books",
    route: BookRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/coupons",
    route: CouponRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoute,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
