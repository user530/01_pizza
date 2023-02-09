const ContactForm = require("../models/ContactForm");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getAllForms = async (req, res, next) => {
  const allForms = await ContactForm.find({}).sort({ createdAt: 1 });

  return res
    .status(StatusCodes.OK)
    .json({ success: true, size: allForms.length, data: allForms });
};

const getSingleForm = async (req, res, next) => {
  const { id } = req.params;

  const singleForm = await ContactForm.findOne({ _id: id });

  if (!singleForm)
    throw new NotFoundError(`Контактная форма с ID: ${id} не найдена!`);

  return res.status(StatusCodes.OK).json({ success: true, data: singleForm });
};

const addSingleForm = async (req, res, next) => {
  const newForm = await ContactForm.create(req.body);

  return res.status(StatusCodes.CREATED).json({ success: true, data: newForm });
};

const deleteSingleForm = async (req, res, next) => {
  const { id } = req.params;

  const deletedForm = await ContactForm.findOneAndDelete({ _id: id });

  if (!deletedForm)
    throw new NotFoundError(`Контактная форма с ID: ${id} не найдена!`);

  return res.status(StatusCodes.OK).json({ success: true, data: deletedForm });
};

module.exports = {
  getAllForms,
  getSingleForm,
  addSingleForm,
  deleteSingleForm,
};
