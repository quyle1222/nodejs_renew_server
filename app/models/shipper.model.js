const mongoose = require("mongoose");

const Shipper = mongoose.model(
  "Shipper",
  new mongoose.Schema({
    username: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    tokenFireBase: {
      type: String,
      default: null,
    },
    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    liReviewShipperDTOs: {
      type: Array,
      default: null,
    },
    rating: {
      type: Number,
      default: null,
    },
    totalPriceProduct: {
      type: Number,
      default: null,
    },
    totalPriceShipment: {
      type: Number,
      default: null,
    },
    totalPrice: {
      type: Number,
      default: null,
    },
    totalOrder: {
      type: Number,
      default: null,
    },
    listOrder: {
      type: Array,
      default: null,
    },
  }),
);

module.exports = Shipper;
