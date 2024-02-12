const mongoose = require("mongoose");
const express = require("express");
const cartRouter = express.Router();
const { Cart, Products } = require("../Models/user.models");
const authMiddleware = require("../Middleware/auth.middleware");

cartRouter.post("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const ids = Number(id);
    const products = await Products.find({ id: ids });
    console.log(products);
    if (products) {
      const cart = new Cart({
        id: id,
        products: products,
      });
      await cart.save();
      res.status(200).send(cart);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

cartRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.find({ userId: userId });
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

cartRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const ids = Number(id);
    const deleteid = await Cart.deleteOne({
      $and: [{ id: ids }, { userId: req.body.userId }],
    });

    if (deleteid) {
      res.status(200).send("Cart deleted successfully");
    } else {
      res.status(404).send("product not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = cartRouter;
