const db = require("../models");
const Order = db.order;
const Shipper = db.shipper;
const firebase = require("./firebase.controller");
const Constant = require("../utils/Constant");
const googleService = require("../service/googleMapService");
const commonFunction = require("../utils/Function")

const handleDirection = async (origin, destination) => {
  const response = await googleService.calculatorDirections(
    origin,
    destination,
  );
  try {
    if (response) {
      const { routes } = response;
      const { legs } = routes[0];
      const { distance, duration, start_address, end_address } = legs[0];
      const dataRes = {
        distance: distance.value,
        duration: duration.value,
        start_address,
        end_address,
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
  const { distance, duration, end_address, start_address } = distanceBranch;
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
  body.receiverAddress = end_address;
  body.branchAddress = start_address;
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
      });
    });
  } catch (error) {}
};

const sendOrderToShipper = (order) => {
  const { latitudeBranch, longitudeBranch } = order;
  const branch = `${latitudeBranch},${longitudeBranch}`;
  try {
    Shipper.find().exec(async (err, response) => {
      let arrayShipper = [];
      await Promise.all(
        response.map(async (item) => {
          const { latitude, longitude } = item.location;
          const shipper = `${latitude},${longitude}`;
          const distanceShipper = await (
            await handleDirection(branch, shipper)
          )?.distance;
          if (distanceShipper < 3000 && item?.onGPS) {
            arrayShipper.push(item);
          }
        }),
      );
      if (arrayShipper.length) {
        const max = arrayShipper.length - 1;
        const min = 0;
        const index = Math.floor(Math.random() * (max - min) + min);
        const { tokenFireBase } = arrayShipper[index];
        firebase.sendOrder(tokenFireBase, order);
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
  } catch (error) {}
};

const getOrderOfShipper = (req, res) => {
  const { userId } = req;
  try {
    Order.find({
      shipper: userId,
      status: Constant.ORDER_COMPLETED,
    }).exec((err, response) => {
      if (err) {
        return res.status(500).send({
          success: false,

          message: err,
        });
      }
      res.send({
        message: null,
        success: true,
        data: response,
      });
    });
  } catch (error) {}
};

const checkInArray = (need, arr) => {
  return arr.indexOf(need) != -1;
};

const getOrderNonShipper = (req, res) => {
  const { userId } = req;
  try {
    Order.find({
      status: Constant.ORDER_CREATE,
      shipper: null,
    }).exec(async (err, response) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err,
        });
      }

      let arrayOrder = [];

      await Promise.all(
        response.map(async (item) => {
          const check = await checkInArray(userId, item.listShipperReject);
          !check ? arrayOrder.push(item) : null;
        }),
      );
      res.status(200).send({
        success: true,
        data: arrayOrder,
      });
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
};

const changeStatusOrder = (req, res) => {
  const { userId, body } = req;
  const { orderId, status, completionTime } = body;
  Order.findOneAndUpdate({ _id: orderId }, { status, completionTime : commonFunction.convertToDate(completionTime) }).exec(
    (error, order) => {
      if (error) {
        return res.status(500).send({
          success: false,
          message: error,
        });
      }
      if (completionTime) {
        Shipper.findOne({ _id: userId }).exec((error, shipper) => {
          const { shipping_fee, goods_fee, total_fee } = order;
          let {
            totalPriceProduct,
            totalPriceShipment,
            totalPrice,
            totalOrder,
          } = shipper;
          totalPriceProduct += goods_fee;
          totalPriceShipment += shipping_fee;
          totalPrice += total_fee;
          totalOrder += 1;
          Shipper.findByIdAndUpdate(
            { _id: userId },
            {
              totalPriceProduct,
              totalPriceShipment,
              totalPrice,
              totalOrder,
            },
          ).exec((error, response) => {
            if (error) {
              return res.status(500).send({
                success: false,
                message: error,
              });
            } else {
              return res.status(200).send({
                success: true,
                data: null,
                message: "Cập nhật thành công",
              });
            }
          });
        });
      } else {
        return res.status(200).send({
          success: true,
          data: null,
          message: "Cập nhật thành công",
        });
      }
    },
  );
};

const getDetailOrder = (req, res) => {
  const { query } = req;
  const { orderId } = query;
  Order.findById(orderId).exec((err, order) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: err,
      });
    }
    return res.status(200).send({
      success: true,
      data: order,
    });
  });
};

module.exports = {
  createOrder,
  getOrderProcessingOfShipper,
  getOrderOfShipper,
  getOrderNonShipper,
  changeStatusOrder,
  getDetailOrder,
};
