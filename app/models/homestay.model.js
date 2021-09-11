const mongoose = require("mongoose");

const HomeStay = mongoose.model(
  "HomeStay",
  new mongoose.Schema({
    nameHomeStay: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    priceHour: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    priceDay: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    city: String,
  }),
);

module.exports = HomeStay;
