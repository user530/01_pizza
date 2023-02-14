const Token = require("../models/Token");
const { UnauthorizedError } = require("../errors");
const { isValid, attachCookiesToResponse } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    // If there is an access token - get the payload and write it to the request
    if (accessToken) {
      const payload = isValid(accessToken);
      req.user = payload.user;
      return next();
    }

    // If no access token - get payload from the refresh token
    const payload = isValid(refreshToken);

    // Find the token
    const token = await Token.findOne({
      user: payload.user.id,
      refreshToken: payload.refreshToken,
    });

    // If no valid token -> throw err
    if (!token || !token?.isValid)
      throw new UnauthorizedError(
        "В процессе авторизации произошла ошибка. Некорректные данные авторизации."
      );

    // If all is fine -> Set cookies and request
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: token.refreshToken,
    });

    res.user = payload.user;

    return next();
  } catch (error) {
    throw new UnauthorizedError(
      "В процессе авторизации произошла ошибка. Некорректные данные авторизации."
    );
  }
};

module.exports = { authenticate };
