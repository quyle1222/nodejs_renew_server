const mongoose = require("mongoose");

const HomeStay = mongoose.model(
  "HomeStay",
  new mongoose.Schema({
    nameHomeStay: {
      type: String,
      trim: true,
      required: true,
    },
    priceHour: {
      type: Number,
      trim: true,
      required: true,
    },
    priceDay: {
      type: Number,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
  }),
);

module.exports = HomeStay;
