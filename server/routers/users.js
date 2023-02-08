const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  addUser,
  updateUser,
} = require("../controllers/userCntrl");

router.route("/users").get(getAllUsers).post(addUser);
router.route("/users/:id").get(getSingleUser).patch(updateUser);

module.exports = router;
