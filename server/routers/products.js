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
router.route("/products").get(getAllProducts).post(addProduct);
router
  .route("/products/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
