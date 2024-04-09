const { Router } = require("express");
const { OrderController } = require("./order.controller");
const { validateRequest } = require("../../middlewares/validateRequest");
const { OrderValidations } = require("./order.validation");

const router = Router();

// create order
router.post(
  "/create-order",
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderController.createOrder
);

// get all orders
router.get("/", OrderController.getAllOrders);

// get user orders
router.get("/:email", OrderController.getUserOrders);

// update order status
router.patch("/:id", OrderController.updateOrderStatus);

const OrderRoutes = router;

module.exports = { OrderRoutes };
