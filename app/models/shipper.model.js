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
      default: 5,
    },
    totalPriceProduct: {
      type: Number,
      default: 0,
    },
    totalPriceShipment: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalSubTract: {
      type: Number,
      default: 0,
    },
    totalOrder: {
      type: Number,
      default: 0,
    },
    listOrder: {
      type: Array,
      default: [],
    },
    avatarURL: {
      type: String,
      default: "",
    },
    description: {
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
    birthDate: {
      type: Date,
      default: "",
    },
  }),
);

module.exports = Shipper;
