const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect( req ,res) {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log("MongoDB connected");
    } catch (error) {
      console.log(error);
    }
}

module.exports = dbConnect