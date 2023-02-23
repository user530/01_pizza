const mongoose = require("mongoose");
const Product = require("./Product");
const { NotFoundError } = require("../errors");

const CartItemSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Types.ObjectId,
    ref: "Cart",
    required: [true, "Экземпляр корзины должен иметь идентификатор корзины."],
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: [true, "Экземпляр корзины должен иметь идентификатор продукта."],
  },
  amount: {
    type: Number,
    required: [true, "Экземпляр корзины должен иметь количество продукта."],
    min: [1, "Количество продукта не может быть меньше "],
  },
});

CartItemSchema.pre("save", async function () {
  // Skip if product doesn't change
  if (!this.isModified("product")) return;

  // If product exists -> check that product is valid one
  const product = await Product.findOne({ _id: this.product });

  // Throw error if not
  if (!product) throw new NotFoundError("Неверный идентификатор продукта.");
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

CartSchema.virtual("products", {
  ref: "CartItem",
  localField: "_id",
  foreignField: "cart",
  justOne: false,
});

const Cart = mongoose.model("Cart", CartSchema);
const CartItem = mongoose.model("CartItem", CartItemSchema);

module.exports = { Cart, CartItem };
