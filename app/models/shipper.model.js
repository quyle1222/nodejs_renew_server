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
      default: "",
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    cmnd: {
      type: String,
      trim: true,
      default: "",
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
      default: [],
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
    totalSubTract: {
      type: Number,
      default: null,
    },
    totalOrder: {
      type: Number,
      default: null,
    },
    listOrder: {
      type: Array,
      default: [],
    },
    avatarURL: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    nameBank: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      default: "",
    },
    onGPS: {
      type: Boolean,
      default: false,
    },
  }),
);

module.exports = Shipper;
