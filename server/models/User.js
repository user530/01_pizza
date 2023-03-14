const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userCart = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "newProduct",
        required: [
          true,
          "Экзмепляр корзины должен иметь идентификатор продукта.",
        ],
      },
      variant: {
        type: mongoose.Types.ObjectId,
        ref: "newProduct.variants",
        required: [
          true,
          "Экзмепляр корзины должен иметь идентификатор варианта.",
        ],
      },
      amount: {
        type: Number,
        required: [true, "Экзмепляр корзины должен иметь количество."],
        min: [
          1,
          "Количество экземпляра корзины не должно быть меньше единицы.",
        ],
      },
    },
  ],
});

userCart.virtual("totalAmount", {
  get() {
    return this.products.reduce((ttlAmnt, singleProduct) => {
      ttlAmnt += singleProduct.amount;
      return ttlAmnt;
    }, 0);
  },
});

const UserSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: [true, "Пожалуйста, введите логин для вашего аккаунта."],
      unique: [
        true,
        "Логин уже используется. Пожалуйста, используйте другой логин.",
      ],
      match: [
        /^\S{3,16}$/,
        "Логин должен содержать от 3 до 16 символов и не включать пробелы.",
      ],
    },
    name: {
      type: String,
      required: [true, "Пожалуйста, укажите ваше имя."],
      match: [
        /^[ЁёА-я]{2,20}$/,
        "Имя должно содержать от 2 до 20 букв русского алфавита.",
      ],
    },
    email: {
      type: String,
      required: [true, "Пожалуйста, введите адрес вашей почты."],
      unique: [
        true,
        "Адрес почты уже используется. Пожалуйста, используйте другой адрес.",
      ],
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Указан некорректный формат почтового адреса.",
      ],
      // validate: {},
    },
    password: {
      type: String,
      required: [true, "Пожалуйста, введите ваш пароль."],
    },
    phone: {
      type: String,
      required: [true, "Пожалуйста, введите ваш телефон."],
      unique: [
        true,
        "Номер телефона уже используется. Пожалуйста, используйте другой номер.",
      ],
      match: [
        /^\d{11}$/,
        "Номер телефона должен содержать 11 цифр без специальных символов.",
      ],
    },
    address: {
      street: {
        type: String,
      },
      house: {
        type: Number,
      },
      flat: {
        type: Number,
      },
    },
    photo: {
      type: String,
      default: "/public/images/uploads/default.jpg",
    },
    subscriptions: {
      messages: {
        type: Boolean,
        default: false,
      },
      email: {
        type: Boolean,
        default: false,
      },
    },

    //
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationDate: Date,
    // passwordToken: {
    //   type: String,
    // },
    // passwordTokenExpirationDate: {
    //   type: Date,
    // },

    cart: userCart,
    // orders: {},
  },
  { timestamps: true }
);

// Hash the password on save
UserSchema.pre("save", async function () {
  // If password is not changed -> skip
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// Built in method to compare passwords
UserSchema.method("comparePasswords", async function (passToCompare) {
  return await bcrypt.compare(passToCompare, this.password);
});

module.exports = mongoose.model("User", UserSchema);
