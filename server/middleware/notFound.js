const { StatusCodes } = require("http-status-codes");

const notFound = async (req, res, next) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, message: "Запрашиваемый путь не найден..." });
};

module.exports = notFound;
