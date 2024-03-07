const express = require("express");
const UserControllers = require("./user.controller");

const router = express.Router();

router.put("/:email", UserControllers.createOrUpdateUser);
router.delete("/:email", UserControllers.removeUser);

const UserRoutes = router;

module.exports = {
  UserRoutes,
};
