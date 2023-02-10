const User = require("../models/User");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const register = async (req, res) => {
  const { email, phone, password, login, name } = req.body;

  // Check arguments
  if (!email || !phone || !password || !login || !name)
    throw new BadRequestError("Предоставьте все требуемые данные.");

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
    msg: "Аккаунт успешно создан! Пожалуйста, проверьте почту и активируйте ваш аккаунт для завершения регистрации.",
  });
};

module.exports = { register };
