const { Router } = require("express");
const auth = require("../../middlewares/auth");
const USER_ROLE = require("../user/user.constant");
const paymentController = require("./payment.controller");

const router = Router();

router.post("/create-payment-intent", auth(USER_ROLE.user), paymentController);

const PaymentRoute = router;

module.exports = { PaymentRoute };
