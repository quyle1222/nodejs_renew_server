const db = require("../models");
const Order = db.order;
const Shipper = db.shipper;
const firebase = require("./firebase.controller");
const Constant = require("../utils/Constant");
const googleService = require("../service/googleMapService");

const handleDirection = async (origin, destination) => {
  const response = await googleService.calculatorDirections(
    origin,
    destination,
  );
  try {
    if (response) {
      const { routes } = response;
      const { legs } = routes[0];
      const { distance, duration } = legs[0];
      const dataRes = {
        distance: distance.value,
        duration: duration.value,
      };
      return dataRes;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const calculatorGoods = (listOrderProductDTOs) => {
  let sum = 0;
  listOrderProductDTOs.forEach((item) => {
    sum += item.finishPriceProduct;
  });
  return sum;
};

const calculatorShippingFee = (distanceBranch) => {
  let sum = 0;
  if (distanceBranch < 3000) {
    return 25000;
  } else {
    const km = (distanceBranch / 1000) * 10000;
    sum = km;
    return sum;
  }
};

const calculatorOrderQuantity = (listOrderProductDTOs) => {
  let sum = 0;
  listOrderProductDTOs.forEach((item) => {
    sum += item.quantityProduct;
  });
  return sum;
};

const createOrder = async (req, res) => {
  const { body } = req;
  const {
    longitudeBranch,
    latitudeBranch,
    longitudeCustomer,
    latitudeCustomer,
    listOrderProductDTOs,
  } = body;
  const origin = `${latitudeBranch},${longitudeBranch}`;
  const destination = `${latitudeCustomer},${longitudeCustomer}`;
  const distanceBranch = await handleDirection(origin, destination);
  const { distance, duration } = distanceBranch;
  const goods_fee = calculatorGoods(listOrderProductDTOs);
  const shipping_fee = calculatorShippingFee(distance);
  const status = Constant.ORDER_CREATE;
  const receivingTime = new Date();
  const quantityProduct = calculatorOrderQuantity(listOrderProductDTOs);
  body.quantityProduct = quantityProduct;
  body.goods_fee = goods_fee;
  body.shipping_fee = shipping_fee;
  body.total_fee = goods_fee + shipping_fee;
  body.status = status;
  body.distanceBranch = distance;
  body.receivingTime = receivingTime;
  body.timingBranchToCustomer = duration;

  const order = new Order(body);
  try {
    order.save((err, response) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
        });
        return;
      }
      sendOrderToShipper(response);
      res.send({
        success: true,
        message: "Tạo đơn hàng thành công , đang xử lý",
        data: response,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const sendOrderToShipper = (order) => {
  const { latitudeBranch, longitudeBranch } = order;
  const p1 = {
    lat: latitudeBranch,
    lon: longitudeBranch,
  };
  try {
    Shipper.find().exec((err, response) => {
      let arrayShipper = [];
      response.forEach(async (item) => {
        const { latitude, longitude } = item.location;
        const branch = `${latitudeBranch},${longitudeBranch}`;
        const shipper = `${latitude},${longitude}`;
        const distanceShipper = await (
          await handleDirection(branch, shipper)
        )?.distance;
        if (distanceShipper < 3000 && item?.onGPS) {
          arrayShipper.push(item);
        }
      });
      if (arrayShipper.length === 0) {
      } else {
        const max = arrayShipper.length - 1;
        const min = 0;
        const index = Math.floor(Math.random() * (max - min) + min);
        const token = arrayShipper[index].tokenFireBase;
        firebase.sendOrder(token, order);
      }
    });
  } catch (error) {}
};

const getOrderProcessingOfShipper = (req, res) => {
  const { userId } = req;
  try {
    Order.find({ shipper: userId }).exec((err, response) => {
      let arrayOrder = [];
      if (err) {
        return res.status(500).send({
          success: false,
          message: err,
        });
      }
      response.map((item) => {
        item.status !== Constant.ORDER_COMPLETED ? arrayOrder.push(item) : null;
      });
      res.send({
        message: null,
        success: true,
        data: arrayOrder,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderOfShipper = (req, res) => {
  const { userId } = req;
  try {
    Order.find({ shipper: userId }).exec((err, response) => {
      let arrayOrder = [];
      if (err) {
        return res.status(500).send({
          success: false,

          message: err,
        });
      }
      response.map((item) => {
        item.status === Constant.ORDER_COMPLETED ? arrayOrder.push(item) : null;
      });
      res.send({
        message: null,
        success: true,
        data: arrayOrder,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createOrder,
  getOrderProcessingOfShipper,
  getOrderOfShipper,
};
