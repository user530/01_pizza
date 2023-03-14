const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../errors");

const { attachCookiesToResponse } = require("../utils/jwt");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const register = async (req, res) => {
  const { email, phone, password, login, name } = req.body;

  // Check arguments
  if (!email || !phone || !password || !login || !name)
    throw new BadRequestError("Предоставьте все требуемые данные.");

  // Password validation (moved from the DB because hashing changes the password)
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&])[A-z\d!@#$%^&]{6,}$/;
  const passwordValid = passwordRegex.test(password);

  if (!passwordValid)
    throw new BadRequestError(
      "Пароль должен быть не меньше 6 символов и содержать как минимум одну заглавную и одну прописную букву, одну цифру и один спец символ. Допустимы символы латинского алфавита, цифры и специальные символы(!,@,#,$,%,^,&)."
    );

  // Check if email is already used
  const existingUser = await User.findOne({ email });

  if (existingUser)
    throw new BadRequestError(
      "Предложенный адрес почты уже используется, пожалуйста, используйте другой."
    );

  // Check if this is the first registered user [Make first registered user is Admin]
  const isFirst = (await User.countDocuments({})) === 0;
  const role = isFirst ? "Admin" : "User";

  // Create token
  const verificationToken = crypto.randomBytes(40).toString("hex");

  // Create new user
  const newUser = await User.create({
    email,
    phone,
    password,
    login,
    name,
    role,
    verificationToken,
  });

  // Server origin
  const origin = process.env.SERVER_ORIGIN;

  // Send verification email
  await sendVerificationEmail({
    email: newUser.email,
    name: newUser.name,
    verificationToken: newUser.verificationToken,
    origin,
  });

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message:
      "Аккаунт успешно создан! Пожалуйста, проверьте почту и активируйте ваш аккаунт для завершения регистрации.",
  });
};

const verifyEmail = async (req, res) => {
  const { email, token } = req.query;

  const verifiedUser = await User.findOne({ email });

  if (!verifiedUser)
    throw new UnauthorizedError(
      "В процессе авторизации произошла ошибка. Пожалуйста повторите запрос позднее или обратитесь в службу поддержки."
    );

  if (verifiedUser.verificationToken !== token)
    throw new UnauthorizedError(
      "В процессе авторизации произошла ошибка. Пожалуйста повторите запрос позднее или обратитесь в службу поддержки."
    );

  // If everything is okay - verify the account and clear the token
  verifiedUser.isVerified = true;
  verifiedUser.verificationDate = Date.now();

  verifiedUser.verificationToken = "";

  // Save changes
  await verifiedUser.save();

  // return res.redirect("http://localhost:3000/");

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Аккаунт успешно активирован." });
};

const login = async (req, res) => {
  const { login, password, anonymousCart } = req.body;

  if (!login || !password)
    throw new BadRequestError("Пожалуйста, введите данные вашего аккаунта.");

  const user = await User.findOne({ login });

  if (!user)
    throw new UnauthorizedError(
      "В процессе авторизации произошла ошибка. Некорректные данные авторизации."
    );

  const passIsValid = await user.comparePasswords(password);

  if (!passIsValid)
    throw new UnauthorizedError(
      "В процессе авторизации произошла ошибка. Некорректные данные авторизации."
    );

  const userIsVerified = user.isVerified;

  if (!userIsVerified)
    throw new UnauthorizedError(
      "В процессе авторизации произошла ошибка. Ваш аккаунт ещё не активирован."
    );

  // If user login first time
  if (!user.cart) {
    // Try to create the cart from anonymous shopping session
    const cartCreated = cartFromArray(user, anonymousCart);
    // If something went wrong -> just create empty cart
    if (!cartCreated) {
      user.cart = { products: [] };
      user.save();
    }
  }

  // Prepare user data
  const tokenizedUser = {
    id: user._id,
    role: user.role,
    name: user.name,
    phone: user.phone,
    address: user.address,
    photo: user.photo,
    cart: user.cart,
    // etc
  };

  // Prepare refresh token
  let refreshToken = "";

  // Check if user already have designated token
  const token = await Token.findOne({ user: tokenizedUser.id });

  if (token) {
    const { isValid } = token;

    if (!isValid)
      throw new UnauthorizedError(
        "В процессе авторизации произошла ошибка. Некорректные данные авторизации."
      );

    // If user already have valid token
    refreshToken = token.refreshToken;

    // Set cookies
    attachCookiesToResponse({ res, user: tokenizedUser, refreshToken });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: { user: tokenizedUser } });
  }

  // If no token exist, create new refresh token
  refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];

  const newTokenObj = { user: tokenizedUser.id, ip, userAgent, refreshToken };

  await Token.create(newTokenObj);

  // Set cookies
  attachCookiesToResponse({ res, user: tokenizedUser, refreshToken });

  return res
    .status(StatusCodes.OK)
    .json({ success: true, data: { user: tokenizedUser } });
};

const logout = async (req, res) => {
  const { id } = req.user;

  // Delete designated token
  await Token.findOneAndDelete({ user: id });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now()),
  };

  // Clear cookies
  res.cookie("accessToken", "logout", cookieOptions);
  res.cookie("refreshToken", "logout", cookieOptions);

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Вы успешно вышли из учётной записи." });
};

const cartFromArray = (user, cartItemsArr) => {
  try {
    cartItemsArr = JSON.parse(cartItemsArr);
    // Assume that everything is valid, try to create the cart from array
    user.cart = { products: cartItemsArr };
    // Save runs validators
    user.save();
    // If all is right - return success flag
    return true;
  } catch (error) {
    // If operation failed, return fail flag
    return false;
  }
};

module.exports = { register, verifyEmail, login, logout };
