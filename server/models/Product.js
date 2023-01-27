const mongoose = require("mongoose");

const imgURL = `http://localhost:5000/public/images/products`;

const productTypesArr = [
  { id: 0, typeName: "Пицца" },
  { id: 1, typeName: "Ролл" },
  { id: 2, typeName: "Блюдо" },
  { id: 3, typeName: "Салат" },
  { id: 4, typeName: "Закуска" },
  { id: 5, typeName: "Напиток" },
  { id: 6, typeName: "Вок" },
  { id: 7, typeName: "Сет" },
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
  "Томат",
  "Грибы",
  "Креветки",
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
      type: mongoose.Types.ObjectId,
      required: [true, "Пожалуйста, выберите тип продукта."],
      ref: "ProductType",
    },
    weight: {
      type: Number,
      required: [true, "Пожалуйста, укажите вес продукта."],
      min: [5, "Вес продукта должен быть больше 5г."],
      max: [5000, "Вес продукта должен быть меньше 5000г."],
    },
    options: {
      type: [
        {
          title: {
            type: String,
            required: [true, "Пожалуйста, укажите название опции."],
          },
          options: {
            type: [String],
          },
        },
      ],
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
    specialPrice: {
      type: Number,
      min: [1, "Акционна цена не может быть меньше 1."],
    },
    tags: {
      type: [String],
      enum: tagsArr,
    },
    img: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Add img link on save
Product.pre("save", function (next) {
  this.img = `${imgURL}/${this.name
    .toString()
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_")}.jpg`;
  next();
});

// Change img link on update
Product.pre("findOneAndUpdate", function (next) {
  const newData = this.getUpdate();
  const newImg = `${imgURL}/${newData.name
    .toString()
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_")}.jpg`;

  newData.img = newImg;
  next();
});

module.exports = mongoose.model("Product", Product);
