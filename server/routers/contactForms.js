const express = require("express");
const router = express.Router();

const {
  getAllForms,
  getSingleForm,
  addSingleForm,
  deleteSingleForm,
} = require("../controllers/contactFormCntrl");

router.route("/contact").get(getAllForms).post(addSingleForm);
router.route("/contact/:id").get(getSingleForm).delete(deleteSingleForm);

module.exports = router;
