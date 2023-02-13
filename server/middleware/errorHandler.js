const { StatusCodes } = require("http-status-codes");

const errorHandler = async (error, req, res, next) => {
  // Дефолтный объект с информацией об ошибке
  let customError = {
    success: false,
    error: {
      status_code: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        error.message ||
        "Что-то пошло не так...Попробуйте повторить запрос позже",
    },
  };

  const { status_code: errCode, message: errMsg } = customError.error;

  //   Ошибка формата данных
  if (error.name === "CastError" && error.path === "_id") {
    errCode = StatusCodes.NOT_FOUND;
    errMsg = `Не верный формат ID номера!`;
    // customError.statusCode = StatusCodes.NOT_FOUND;
    // customError.message = `Не верный формат ID номера!`;
  }

  //   Ошибка валидации БД
  if (error.name === "ValidationError") {
    errCode = StatusCodes.BAD_REQUEST;
    errMsg = Object.values(error.errors)
      .map((errObj) => errObj.message)
      .join(" ");
  }

  //   Ошибка дублирования уникальных данных
  if (error.code && error.code === 11000) {
    errCode = StatusCodes.BAD_REQUEST;
    errMsg = `Невозможно добавить уникальное значение: ${Object.keys(
      error.keyValue
    ).join(", ")}`;
  }

  return res.status(errCode).json({ ...customError });
};

module.exports = errorHandler;
