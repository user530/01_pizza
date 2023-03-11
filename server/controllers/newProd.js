const newProduct = require("../models/newProduct");
const { StatusCodes } = require("http-status-codes");

const getAllProd = async (req, res) => {
  const allProd = await newProduct.find({});

  return res.status(StatusCodes.OK).json({ success: true, data: allProd });
};

const getProductsByType = async (req, res) => {
  const products = await newProduct.find({
    productType: req.params.prodType,
  });

  return res.status(StatusCodes.OK).json({ success: true, data: products });
};

const addNewProd = async (req, res, next) => {
  const newProd = await newProduct.create(req.body);

  return res.status(StatusCodes.OK).json({ success: true, data: newProd });
};

module.exports = { getAllProd, getProductsByType, addNewProd };
