const config = require("../config/auth.config");
const db = require("../models");
const Constant = require("../utils/Constant");

const Shipper = db.shipper;
const Order = db.order;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signUp = (req, res) => {
  const { body } = req;
  const { username, password } = body;
  const user = new Shipper({
    username,
    password: bcrypt.hashSync(password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    res.send({
      success: true,
      message: "User was registered successfully!",
      data: user,
    });
  });
};

const signIn = (req, res) => {
  const { body } = req;
  const { username, password } = body;
  Shipper.findOne({
    username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not found.",
      });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        success: false,
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    user.token = token;

    res.status(200).send({
      success: true,
      data: {
        _id: user._id,
        username: user.name,
        token: user.token,
      },
    });
  });
};

const getInfo = (req, res) => {
  const { userId } = req;
  Shipper.findOne({
    _id: userId,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not found.",
      });
    }
    res.status(200).send({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        liReviewShipperDTOs: user.liReviewShipperDTOs,
        location: user.location,
        liReviewShipperDTOs: user.liReviewShipperDTOs,
        rating: user.rating,
        totalPriceProduct: user.totalPriceProduct,
        totalPriceShipment: user.totalPriceShipment,
        totalPrice: user.totalPrice,
        totalOrder: user.totalOrder,
        listOrder: user.listOrder,
      },
    });
  });
};

const convertToTime = (date) => {
  return date.getHours();
};

const handleStatistical = (listOrder) => {
  const array = Array(24).fill(0);
  if (listOrder && listOrder.length > 0) {
    listOrder.forEach((order) => {
      const completionTime = convertToTime(order.completionTime);
      array.forEach((item, index) => {
        if (completionTime === index) {
          array[index] += order.shipmentPrice;
        }
      });
    });
  }
  return array;
};

const getStatistical = async (req, res) => {
  const { query } = req;
  let { shipperId, dateIn } = query;

  let day = new Date();
  day = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;

  Order.find({
    shipperId,
    dateIn: dateIn || day,
    status: Constant.ORDER_COMPLETED,
  }).exec((err, order) => {
    const arrayPrice = handleStatistical(order);
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    const hour = [
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
    ];
    return res.status(200).send({
      success: true,
      message: {
        dateIn: dateIn || day,
        hour,
        arrayPrice,
      },
    });
  });
};

const approvedOrder = async (req, res) => {
  const { body, userId } = req;
  const { orderId, isApproved } = body;

  if (isApproved) {
    const newData = {
      shipper: userId,
      status: Constant.ORDER_APPROVED,
    };
    Order.findOneAndUpdate({ _id: orderId }, newData, {
      useFindAndModify: false,
      new: true,
    }).exec((err, order) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Đã xảy ra lỗi",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Đã chấp nhận đơn hàng",
        data: order,
      });
    });
  }
};

const updateLocationAndStatus = (req, res) => {
  const { body, userId } = req;
  const { location } = body;
  Shipper.findByIdAndUpdate().exec((err, res) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: err,
      });
    }
  });
};

const updateInformation = (req, res) => {
  const { body } = req
}

module.exports = {
  signUp,
  signIn,
  getInfo,
  getStatistical,
  approvedOrder,
  updateLocationAndStatus,
  updateInformation,
};
