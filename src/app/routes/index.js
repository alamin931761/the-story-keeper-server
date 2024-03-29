const express = require("express");
const { UserRoutes } = require("../modules/user/user.route");
const { BookRoutes } = require("../modules/book/book.route");
const { ReviewRoutes } = require("../modules/review/review.route");

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
