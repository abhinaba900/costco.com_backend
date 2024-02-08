const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
const productSchema = new mongoose.Schema({
  default: String,
  quantity: {
    type: Number,
    default: 0,
  },
});

const cartSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    default: String,
    products: [],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
const Products = mongoose.model("products", productSchema);
const User = mongoose.model("User", userSchema);

module.exports = { User, Products, Cart };
