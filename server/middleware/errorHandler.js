const { StatusCodes } = require("http-status-codes");

const errorHandler = async (error, req, res, next) => {
  // Дефолтный объект с информацией об ошибке
  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message:
      error.message ||
      "Что-то пошло не так...Попробуйте повторить запрос позже",
  };

  //   Ошибка формата данных
  if (error.name === "CastError" && error.path === "_id") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = `Не верный формат ID номера!`;
  }

  //   Ошибка валидации БД
  if (error.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(error.errors)
      .map((errObj) => errObj.message)
      .join(" ");
  }

  //   Ошибка дублирования уникальных данных
  if (error.code && error.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Невозможно добавить уникальное значение: ${Object.keys(
      error.keyValue
    ).join(", ")}`;
  }

  return res.status(customError.statusCode).json({ errors: customError });
};

module.exports = errorHandler;
