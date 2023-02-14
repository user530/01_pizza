const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const isValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = oneDay * 30;

  const secureCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
  };

  res.cookie("accessToken", accessTokenJWT, {
    ...secureCookieOptions,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    ...secureCookieOptions,
    expires: new Date(Date.now() + oneMonth),
  });
};

module.exports = { attachCookiesToResponse, isValid };
