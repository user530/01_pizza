const express = require("express");
const router = express.Router();

const {
  getAllForms,
  getSingleForm,
  addSingleForm,
  deleteSingleForm,
} = require("../controllers/contactFormCntrl");

router.route("/").get(getAllForms).post(addSingleForm);
router.route("/:id").get(getSingleForm).delete(deleteSingleForm);

module.exports = router;
