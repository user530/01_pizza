const express = require("express");
const router = express.Router();

// Controller functions for the Product Types
const {
  getAllProdTypes,
  getSingleProdType,
  addProdType,
  updateProdType,
  deleteProdType,
} = require("../controllers/prodTypesCntrl");

// Set-up routes
router.route("/product_types").get(getAllProdTypes).post(addProdType);
router
  .route("/product_types/:id")
  .get(getSingleProdType)
  .patch(updateProdType)
  .delete(deleteProdType);

module.exports = router;
