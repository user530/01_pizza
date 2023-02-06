const mongoose = require("mongoose");

const ContactFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Контактая форма должна содержать имя"],
      match: [
        /^[ЁёА-я]{2,20}$/,
        "Имя должно содержать от 2 до 20 символов и использовать только буквы русского алфавита!",
      ],
    },
    phone: {
      type: String,
      required: [true, "Контактая форма должна содержать телефон"],
      match: [
        /^\d{11}$/,
        "Номер телефона должен содержать 11 цифр и не использовать спецсимволов!",
      ],
    },
    info: String,
    served: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactForm", ContactFormSchema);
