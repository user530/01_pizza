const express = require("express");
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  logout,
} = require("../controllers/authCntrl");

router.route("/register").post(register);
router.route("/verify-email/").get(verifyEmail);
router.route("/login").post(login);
router.route("/logout").delete(logout);

module.exports = router;
