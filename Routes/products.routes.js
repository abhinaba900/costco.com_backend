const express = require("express");
const productRouter = express.Router();
const { Products } = require("../Models/user.models");

// GET all products
productRouter.get("/", async (req, res) => {
  const { sort, search } = req.query;
  let query = {};

  // Constructing a search query if a search term is provided
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } }, // Searches in 'name'
      // Add other fields you want to include in the search, for example:
      // { description: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    let productsQuery = Products.find(query);

    // Sorting
    if (sort) {
      productsQuery = productsQuery.sort(sort); // Directly use the sort query param
    }

    const products = await productsQuery;
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving products",
      error: error.message,
    });
  }
});

// GET a single product by ID
productRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Adjusted to search for the product using the custom `id` field
    let ids = Number(id);
    console.log(typeof id);
    const product = await Products.find({ id: ids }); // Using ES6 shorthand for { id: id }
    if (!product || product.length === 0) {
      // If the product with the given ID was not found
      return res.status(404).send({
        message: "Product not found",
      });
    }
    // Successfully retrieved the product
    res.status(200).send(product);
  } catch (error) {
    if (error.kind === "ObjectId") {
      // This error check might not be necessary if `id` is not an ObjectId
      // But you might want to keep some form of validation for the `id`
      return res.status(400).send({
        message: "Invalid product ID",
      });
    }
    // Internal server error
    res.status(500).send({
      message: "Error retrieving product",
      error: error.message,
    });
  }
});

module.exports = productRouter;
