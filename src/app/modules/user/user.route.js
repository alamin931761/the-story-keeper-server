const express = require("express");
const UserControllers = require("./user.controller");
const { validateRequest } = require("../../middlewares/validateRequest");
const { userValidations } = require("./user.validation");

const router = express.Router();

// create user or login user
router.put(
  "/create-or-login-user",
  validateRequest(userValidations.createUserValidationSchema),
  UserControllers.createOrLoginUser
);

// get single user
router.get("/:email", UserControllers.getSingleUser);

// get all users
router.get("/", UserControllers.getAllUsers);

// update profile
router.patch(
  "/update-profile/:email",
  validateRequest(userValidations.updateProfileValidationSchema),
  UserControllers.updateProfile
);

// update role
router.patch("/update-role/:email", UserControllers.updateRole);

const UserRoutes = router;

module.exports = {
  UserRoutes,
};
