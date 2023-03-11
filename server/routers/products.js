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

const {
  getAllProd,
  getProductsByType,
  addNewProd,
} = require("../controllers/newProd");

router.route("/new/").get(getAllProd).post(addNewProd);
router.route("/new/:prodType").get(getProductsByType);

// Set-up routes
router.route("/").get(getAllProducts).post(addProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
