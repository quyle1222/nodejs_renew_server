const config = require("../config/auth.config");
const db = require("../models");
const Order = db.order;
const Shipper = db.shipper;
const firebase = require("./firebase.controller");

const distance = (lat1, lon1, lat2, lon2, unit) => {
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
};

const calculatorGoods = (listOrderProductDTOs) => {
  let sum = 0;
  listOrderProductDTOs.forEach((item) => {
    sum += item.finishPriceProduct;
  });
  return sum;
};

const calculatorShippingFee = (distanceBranch) => {
  const sum = 0;
  if (distanceBranch <= 2.5) {
    return 25000;
  } else {
    const km = (distanceBranch / 10) * 10000;
    const meters = (distanceBranch % 10) * 10000;
    sum = km + meters;
    return sum;
  }
};

const createOrder = (req, res) => {
  const { body } = req;
  const {
    longitudeBranch,
    latitudeBranch,
    longitudeCustomer,
    latitudeCustomer,
    listOrderProductDTOs,
  } = body;

  const distanceBranch = distance(
    latitudeBranch,
    longitudeBranch,
    latitudeCustomer,
    longitudeCustomer,
    "K",
  );

  const goods_fee = calculatorGoods(listOrderProductDTOs);
  const shipping_fee = calculatorShippingFee(distanceBranch);
  const status = "ORDER_CREATE";
  const receivingTime = new Date();

  body.goods_fee = goods_fee;
  body.shipping_fee = shipping_fee;
  body.total_fee = goods_fee + shipping_fee;
  body.status = status;
  body.distanceBranch = distanceBranch;
  body.receivingTime = receivingTime;
  body.timingBranchToCustomer = distanceBranch * 60 * 15;

  const order = new Order(body);
  order.save((err, response) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    console.log("response", response);
    sendOrderToShipper(response);
    res.send({
      success: true,
      message: "Tạo đơn hàng thành công , đang xử lý",
      data: response,
    });
  });
};

const sendOrderToShipper = (order) => {
  const { latitudeBranch, longitudeBranch } = order;
  const p1 = {
    lat: latitudeBranch,
    lon: longitudeBranch,
  };
  Shipper.find().exec((err, response) => {
    let arrayShipper = [];
    response.forEach((item) => {
      const { latitude, longitude } = item.location;

      const distanceShipper = distance(
        latitudeBranch,
        longitudeBranch,
        latitude,
        longitude,
        "K",
      );

      if (distanceShipper < 3) {
        arrayShipper.push(item);
      }
    });

    if (arrayShipper.length === 0) {
      console.log("Hiện tại không có shipper");
    } else {
      const max = arrayShipper.length - 1;
      const min = 0;
      const index = Math.floor(Math.random() * (max - min) + min);

      const token = arrayShipper[index].tokenFireBase;
      firebase.sendOrder(token, order);
      console.log("Đang tìm shipper");
    }
  });
};

module.exports = {
  createOrder,
};
