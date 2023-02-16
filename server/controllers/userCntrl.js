const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

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
    throw new BadRequestError("Please, provide valid user information");

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

const getMe = async (req, res) => {
  console.log("GET ME FIRED");

  return res
    .status(StatusCodes.OK)
    .json({ success: true, data: { user: req.user } });
};

module.exports = { getAllUsers, getSingleUser, updateUser, getMe };
