const mongoose = require("mongoose");

const imgURL = `/public/images/products`;

const prodIngredients = [
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

const productVariant = new mongoose.Schema({
  options: {
    type: Map,
    of: String,
  },
  weight: {
    type: Number,
    required: [true, "Пожалуйста, укажите вес продукта."],
    min: [5, "Вес продукта должен быть больше 5г."],
    max: [5000, "Вес продукта должен быть меньше 5000г."],
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
});

const newProductSchema = new mongoose.Schema(
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
    ingredients: {
      type: [String],
      enum: prodIngredients,
    },
    img: {
      type: String,
      default: "",
    },
    variants: [productVariant],
  },
  { timestamps: true }
);

newProductSchema.pre("save", function (next) {
  this.img = `${imgURL}/${this.name
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_")}.jpg`;

  next();
});

newProductSchema.pre("findOneAndUpdate", function (next) {
  const newData = this.getUpdate();
  const newImg = `${imgURL}/${newData.name
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_")}.jpg`;
  newData.img = newImg;

  next();
});

module.exports = mongoose.model("newProduct", newProductSchema);
