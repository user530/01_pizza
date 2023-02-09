const express = require("express");
const router = express.Router();

// Controller functions for the Products (CRUD)
const {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productCntrl");

// Set-up routes
router.route("/").get(getAllProducts).post(addProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
