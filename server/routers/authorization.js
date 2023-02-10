const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authCntrl");

router.route("/register").post(register);
router.route("/verify-email/").get((req, res) => {
  console.log(req.query);
  return res
    .status(200)
    .json({ success: true, msg: "Ваш аккаунт был успешно активирован" });
});

module.exports = router;
