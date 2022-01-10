const mongoose = require("mongoose");
const express = require("express");
const validator = require("validator");

mongoose
  .connect("mongodb://localhost:27017/myapp")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(() => {
    console.log("Could not connect");
  });

const myCollectionSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (validator.isEmail(value)) {
      } else {
        throw new Error("Email is not valid");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
});

const myRESTCollection = new mongoose.model(
  "myRESTCollection",
  myCollectionSchema
);

module.exports = myRESTCollection;
