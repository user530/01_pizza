const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Токен должен быть прикреплён к пользователю."],
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    ip: {
      type: String,
      required: [true, "Токен должен быть прикреплён к IP адресу."],
    },
    userAgent: {
      type: String,
      required: [
        true,
        "Токен должен быть прикреплён к пользовательскому браузеру.",
      ],
    },
    refreshToken: {
      type: String,
      required: [true, "Токен должен иметь рефреш токен."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
