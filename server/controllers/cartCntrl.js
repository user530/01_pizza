const { Cart, CartItem } = require("../models/Cart");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const createCart = async (req, res) => {
  const cartObj = {};
  if (req.user) cartObj.user = req.user.id;

  const newCart = await Cart.create(cartObj);

  return res.status(StatusCodes.CREATED).json({ success: true, data: newCart });
};

const getCart = async (req, res) => {
  const { id: cartId } = req.params;

  const cart = await Cart.findOne({ _id: cartId }).populate({
    path: "products",
    populate: { path: "product" },
  });

  if (!cart) throw new NotFoundError("Корзина не найдена.");

  return res.status(StatusCodes.OK).json({ success: true, data: cart });
};

const clearCart = async (req, res) => {
  const { id: cartId } = req.params;

  if (!cartId)
    throw new BadRequestError("Запрос должен содержать идентификатор корзины.");

  // Clear all cart items associated with the selected cart
  const clearedItems = await CartItem.deleteMany({ cart: cartId });

  return res.status(StatusCodes.OK).json({ success: true, data: clearedItems });
};

const addItemToCart = async (req, res) => {
  const { id: cartId } = req.params;

  const { product, amount } = req.body;

  // Check if cart item is already exists
  const existingItem = await CartItem.findOne({ cart: cartId, product });
  let cartItem;

  // If this item doesn't exist ->
  if (!existingItem) {
    // Create one
    cartItem = await CartItem.create({ cart: cartId, product, amount });
  }
  // If item exist -> update quantity
  else
    cartItem = await CartItem.findOneAndUpdate(
      { cart: cartId, product },
      { amount: existingItem.amount + amount },
      { new: true }
    );

  return res.status(StatusCodes.OK).json({ success: true, data: cartItem });
};

const setCartItem = async (req, res) => {
  const { id: cartId } = req.params;

  const { product, newAmount } = req.body;

  const cartItem = await CartItem.findOne({
    cart: cartId,
    product: { $in: product },
  });

  if (!cartItem) throw new NotFoundError("Корзина не содержит этот продукт");

  // Delete cart item if the new amount is 0 or out of range
  if (newAmount <= 0) await cartItem.delete();
  // Update amount if new amount is valid
  else {
    cartItem.amount = newAmount;
    cartItem.save();
  }

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, data: cartItem });
};

module.exports = {
  createCart,
  getCart,
  clearCart,
  addItemToCart,
  setCartItem,
};
