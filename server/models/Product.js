const mongoose = require("mongoose");

const ingredientsArr = [
  "Соус красный",
  "Сыр",
  "Охотничьи колбаски",
  "Перец болгарский",
  "Маслины",
  "Cоус белый",
  "Мясо курица",
  "Мясо ветчина",
  "Лук красный",
  "Ананас",
  "Моцарелла",
];

const tagsArr = ["Акция", "Новинка", "Популярное"];

const Ingredient = new mongoose.Schema({ name: String, enum: ingredientsArr });
const Tag = new mongoose.Schema({ name: String, enum: tagsArr });

const Product = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Пожалуйста, введите название продукта"],
    minLength: [3, "Название продукта должно быть не меньше 3 символов"],
    maxLength: [20, "Название продукта должно быть не больше 20 символов"],
    match: [
      /^([ЁёА-я]+( [ЁёА-я])*){3,20}$/,
      "Название продукта должно содержать только буквы (кириллица) в размере 3-20 символов",
    ],
  },
  productType: {
    type: String,
    required: [true, "Пожалуйста, выберите тип продукта"],
    enum: [
      "Пицца",
      "Ролл",
      "Блюдо",
      "Салат",
      "Закуска",
      "Напиток",
      "Вок",
      "Сет",
    ],
  },
  weight: {
    type: Number,
    required: [true, "Пожалуйста, укажите вес продукта"],
    min: [5, "Вес продукта должен быть больше 5г"],
    max: [5000, "Вес продукта должен быть меньше 5000г"],
  },
  size: {
    type: Number,
    required: [true, "Пожалуйста, укажите размер продукта"],
    min: [1, "Размер продукта не должен быть меньше 1"],
  },
  ingredients: {
    type: [Ingredient],
  },
  price: {
    type: Number,
    required: [true, "Пожалуйста, укажите цену продукта"],
    min: [1, "Цена не может быть меньше 1"],
  },
  tags: {
    type: [Tag],
  },
});

module.exports = mongoose.model("Product", Product);
