const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipper",
      default: null,
    },
    branchName: {
      type: String,
      default: null,
    },
    branchAddress: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "ORDER_CREATE",
    },
    statusId: {
      type: Number,
      default: 0,
    },
    shipping_fee: {
      type: Number,
      default: 0,
    },
    goods_fee: {
      type: Number,
      default: 0,
    },
    total_fee: {
      type: Number,
      default: 0,
    },
    timingBranchToCustomer: {
      type: Number,
      default: 0,
    },
    branchPhone: {
      type: String,
      default: null,
    },
    receiverName: {
      type: String,
      default: null,
    },
    receiverAddress: {
      type: String,
      default: null,
    },
    receiverPhone: {
      type: String,
      default: null,
    },
    receiverPhone: {
      type: String,
      default: null,
    },
    listOrderProductDTOs: {
      type: Array,
      default: null,
      required: true,
    },
    longitudeCustomer: {
      type: Number,
      default: null,
      required: true,
    },
    latitudeCustomer: {
      type: Number,
      default: null,
      required: true,
    },
    longitudeBranch: {
      type: Number,
      default: null,
      required: true,
    },
    latitudeBranch: {
      type: Number,
      default: null,
      required: true,
    },
    orderQuantity: {
      type: Number,
      default: 0,
      required: true,
    },
    timeBranch: {
      type: String,
      default: null,
    },
    distanceBranch: {
      type: Number,
      default: 0,
    },
    distanceShipper: {
      type: Number,
      default: 0,
    },
    receivingTime: {
      type: String,
      default: null,
    },
    completionTime: {
      type: Date,
      default: null,
    },
    listShipperReject: {
      type: Array,
      default: null,
    },
  }),
);

module.exports = Order;
