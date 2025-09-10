const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isAlphanumeric().isLength({ min: 8 }),
  ],
  userController.register
);
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").isAlphanumeric().isLength({ min: 8 }).notEmpty(),
  ],
  userController.login
);
module.exports = router;
