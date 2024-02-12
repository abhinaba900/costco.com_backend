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
  userId: {
    type: String,
    required: true,
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
    userId: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const forgotCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    verificationToken: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
const Products = mongoose.model("products", productSchema);
const User = mongoose.model("User", userSchema);
const ForgotCode = mongoose.model("forgotCode", forgotCodeSchema);

module.exports = { User, Products, Cart, ForgotCode };
