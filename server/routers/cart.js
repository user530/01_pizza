const express = require("express");
const router = express.Router();

const {
  getCart,
  createCart,
  clearCart,
  addItemToCart,
  setCartItem,
} = require("../controllers/cartCntrl");

router.route("/").post(createCart);
router
  .route("/:id")
  .get(getCart)
  .post(addItemToCart)
  .delete(clearCart)
  .patch(setCartItem);

module.exports = router;
