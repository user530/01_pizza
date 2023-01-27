const Product = require("../models/Product");
const { NotFoundError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllProducts = async (req, res, next) => {
  const products = await Product.find({}).sort({ productType: 1, name: 1 });

  return res
    .status(StatusCodes.OK)
    .json({ success: true, size: products.length, data: products });
};

const getSingleProduct = async (req, res, next) => {
  const singleProduct = await Product.findOne({ _id: req.params.id });

  if (!singleProduct)
    throw new NotFoundError(`Продукт с ID: ${req.params.id} не найден!`);

  return res
    .status(StatusCodes.OK)
    .json({ success: true, data: singleProduct });
};

const addProduct = async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, data: newProduct });
};

const updateProduct = async (req, res, next) => {
  const { name, productType, weight, options, ingredients, price, tags } =
    req.body;

  if (
    !name ||
    !productType ||
    !weight ||
    !options ||
    !ingredients ||
    !price ||
    !tags
  )
    throw new BadRequestError("Пожалуйста, заполните все обязательные поля!");

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedProduct)
    throw new NotFoundError(`Продукт с ID: ${req.params.id} не найден!`);

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, data: updatedProduct });
};

const deleteProduct = async (req, res, next) => {
  const deleted = await Product.findOneAndDelete({ _id: req.params.id });

  if (!deleted)
    throw new NotFoundError(`Продукт с ID: ${req.params.id} не найден!`);

  return res.status(StatusCodes.OK).json({ success: true, data: deleted });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
