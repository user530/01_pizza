const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { attachCookiesToResponse } = require("../utils/jwt");

const getAllUsers = async (req, res, next) => {
  const allUsers = await User.find({}).select("-password");

  return res
    .status(StatusCodes.OK)
    .json({ success: true, size: allUsers.length, data: allUsers });
};

const getSingleUser = async (req, res, next) => {
  const user = await User.find({ _id: req.params.id }).select("-password");

  if (!user)
    throw new NotFoundError(`Продукт с ID: ${req.params.id} не найден!`);

  return res.status(StatusCodes.OK).json({ success: true, data: user });
};

const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { email, phone, address, photo, subscriptions } = req.body;

  if (!email || !phone || !address || !photo || !subscriptions)
    throw new BadRequestError("Пожалуйста, заполните все необходимые данные!");

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { email, phone, address, photo, subscriptions },
    { new: true, runValidators: true }
  );

  if (!updatedUser)
    throw new NotFoundError(`Продукт с ID: ${req.params.id} не найден!`);

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, data: updatedUser });
};

const addToUserCart = async (req, res) => {
  const { id } = req.params;
  const { product, variant, amount } = req.body;

  if (!product || !variant || !amount)
    throw new BadRequestError("Пожалуйста заполните данные продукта!");

  const user = await User.findOne({ _id: id });

  if (!user) throw new NotFoundError("Пользователь не найден!");

  const userProducts = user.cart.products;

  // Check if cart already has this item
  const prodMatches = userProducts.filter(
    (cartItem) =>
      cartItem.product.toString() === product &&
      cartItem.variant.toString() === variant
  );

  // Item doesn't exist -> add item to the cart
  if (prodMatches.length === 0) {
    const newProducts = [...userProducts, { product, variant, amount }];

    user.cart.products.push({ product, variant, amount });
    user.save();

    // attachCookiesToResponse({ res, user });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: newProducts });
  }

  // If item exists, increment the amount
  prodMatches[0].amount += amount;
  user.save();

  return res.status(StatusCodes.OK).json({ success: true, data: userProducts });
};

const getMe = async (req, res) => {
  const { id } = req.user;

  const user = await User.findOne({ _id: id });
  const cart = user.cart.products;

  return res
    .status(StatusCodes.OK)
    .json({ success: true, data: { user, cart } });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  addToUserCart,
  getMe,
};
