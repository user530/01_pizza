const ProductType = require("../models/ProductType");
const { NotFoundError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllProdTypes = async (req, res, next) => {
  const prodTypes = await ProductType.find({}).sort({ typename: 1 });

  return res
    .status(StatusCodes.OK)
    .json({ success: true, size: prodTypes.length, data: prodTypes });
};

const getSingleProdType = async (req, res, next) => {
  const singleProdType = await ProductType.findOne({ _id: req.params.id });

  if (!singleProdType)
    throw new NotFoundError(`Тип продукта с ID: ${req.params.id} не найден!`);

  return res
    .status(StatusCodes.OK)
    .json({ success: true, data: singleProdType });
};

const addProdType = async (req, res, next) => {
  const newProdType = await ProductType.create(req.body);

  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, data: newProdType });
};

const updateProdType = async (req, res, next) => {
  const { typeName: newTypeName } = req.body;

  if (!newTypeName)
    throw new BadRequestError("Пожалуйста, заполните все обязательные поля!");

  const newProdType = await ProductType.findOneAndUpdate(
    { _id: req.params.id },
    { typeName: newTypeName },
    { new: true, runValidators: true }
  );

  if (!newProdType)
    throw new NotFoundError(`Тип продукта с ID: ${req.params.id} не найден!`);

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, data: newProdType });
};

const deleteProdType = async (req, res, next) => {
  const delProdType = await ProductType.findOneAndDelete({
    _id: req.params.id,
  });

  if (!delProdType)
    throw new NotFoundError(`Тип продукта с ID: ${req.params.id} не найден!`);

  return res.status(StatusCodes.OK).json({ success: true, data: delProdType });
};

module.exports = {
  getAllProdTypes,
  getSingleProdType,
  addProdType,
  updateProdType,
  deleteProdType,
};
