const express = require("express");
const router = express.Router();
const { register, verifyEmail } = require("../controllers/authCntrl");

router.route("/register").post(register);
router.route("/verify-email/").get(verifyEmail);

module.exports = router;
