const mongoose = require("mongoose");
const express = require("express");
const cartRouter = express.Router();
const { Cart, Products } = require("../Models/user.models");

cartRouter.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ids = Number(id);
    const products = await Products.find({ id: ids });
    console.log(products)
     if (products) {
       const cart = new Cart({
         id: id,
         products: products,
       });
       await cart.save();
       res.status(200).send(cart);
     }
     else {
       res.status(404).send("Product not found");
     }
   
  } catch (error) {
    res.status(500).send(error.message);
  }
});

cartRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ids = Number(id);
    const deleteid = await Cart.deleteOne({ id: ids });

    if (deleteid) {
      res.status(200).send("Cart deleted successfully");
    } else {
      res.status(404).send("product not found");
    }
   
  } catch (error) {
    res.status(500).send(error.message);
  }
})


module.exports = cartRouter;
