const { Router } = require("express");
const { OrderController } = require("./order.controller");
const { validateRequest } = require("../../middlewares/validateRequest");
const { OrderValidations } = require("./order.validation");
const auth = require("../../middlewares/auth");
const USER_ROLE = require("../user/user.constant");

const router = Router();

// create order
router.post(
  "/create-order",
  auth(USER_ROLE.user),
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderController.createOrder
);

// get all orders
router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OrderController.getAllOrders
);

// get user orders
router.get("/:email", auth(USER_ROLE.user), OrderController.getUserOrders);

// update order status
router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OrderController.updateOrderStatus
);

const OrderRoutes = router;

module.exports = { OrderRoutes };
