const mongoose = require("mongoose");

const productTypesArr = [
  "Пицца",
  "Ролл",
  "Блюдо",
  "Салат",
  "Закуска",
  "Напиток",
  "Вок",
  "Сет",
];

const ingredientsArr = [
  "Соус красный",
  "Соус белый",
  "Соус спайс",
  "Сыр",
  "Охотничьи колбаски",
  "Перец болгарский",
  "Маслины",
  "Мясо курица",
  "Мясо ветчина",
  "Лук красный",
  "Ананас",
  "Моцарелла",
  "Рис",
  "Нори",
  "Рыба лосось",
  "Огурец",
];

const tagsArr = ["Акция", "Новинка", "Популярное"];

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Пожалуйста, введите название продукта."],
      minLength: [3, "Название продукта должно быть не меньше 3 символов."],
      maxLength: [20, "Название продукта должно быть не больше 20 символов."],
      match: [
        /^([ЁёА-я]+( [ЁёА-я])*){3,20}$/,
        "Название продукта должно содержать только буквы (кириллица) в размере 3-20 символов.",
      ],
      unique: true,
    },
    productType: {
      type: String,
      required: [true, "Пожалуйста, выберите тип продукта."],
      enum: productTypesArr,
    },
    weight: {
      type: Number,
      required: [true, "Пожалуйста, укажите вес продукта."],
      min: [5, "Вес продукта должен быть больше 5г."],
      max: [5000, "Вес продукта должен быть меньше 5000г."],
    },
    size: {
      type: Number,
      required: [true, "Пожалуйста, укажите размер продукта."],
      min: [1, "Размер продукта не должен быть меньше 1."],
    },
    ingredients: {
      type: [String],
      enum: ingredientsArr,
    },
    price: {
      type: Number,
      required: [true, "Пожалуйста, укажите цену продукта."],
      min: [1, "Цена не может быть меньше 1."],
    },
    tags: {
      type: [String],
      enum: tagsArr,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product);
