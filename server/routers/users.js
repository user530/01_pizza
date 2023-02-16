const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
} = require("../controllers/userCntrl");

const { authenticate } = require("../middleware/authenticate");

router.route("/").get(authenticate, getAllUsers);
router.route("/get_me").get(authenticate, getMe);
router
  .route("/:id")
  .get(authenticate, getSingleUser)
  .patch(authenticate, updateUser);

module.exports = router;
