const mongoose = require("mongoose");

const ProductType = new mongoose.Schema({
  typeName: {
    type: String,
    required: [true, "Укажите название типа продукта."],
    unique: [true, "Название типа продукта уже используется."],
    minLength: [3, "Название типа продукта не должно быть короче 3 символов."],
    maxLength: [
      20,
      "Название типа продукта не должно быть длиннее 20 символов.",
    ],
  },
});

module.exports = mongoose.model("ProductType", ProductType);
