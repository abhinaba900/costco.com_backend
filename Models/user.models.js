const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})
const productSchema = new mongoose.Schema({
    default: String,
})

const Products = mongoose.model("products", productSchema);
const User = mongoose.model("User", userSchema);

module.exports = {User, Products}