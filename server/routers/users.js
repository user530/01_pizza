const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
  addToUserCart,
} = require("../controllers/userCntrl");

const { authenticate } = require("../middleware/authenticate");

router.route("/").get(authenticate, getAllUsers);
router.route("/get_me").get(authenticate, getMe);
router.route("/:id").get(getSingleUser).patch(authenticate, updateUser);

router.route("/addToCart/:id").post(addToUserCart);

module.exports = router;
