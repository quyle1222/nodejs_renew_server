const config = require("../config/auth.config");
const db = require("../models");
const Constant = require("../utils/Constant");
const commonFunction = require("../utils/Function");

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

const resetPassword = (req, res) => {
  const { body, userId } = req;
  const { oldPassword, newPassword } = body;
  if (
    !newPassword ||
    !oldPassword ||
    !newPassword.trim() ||
    !oldPassword.trim()
  ) {
    res.status(500).send({
      success: false,
      message: "Chưa nhập password",
    });
    return;
  }
  Shipper.findOne({ _id: userId }).exec((error, user) => {
    if (error) {
      res.status(500).send({
        success: false,
        message: error,
      });
      return;
    }
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not found.",
      });
    }
    const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordIsValid || !newPassword) {
      return res.status(401).send({
        success: false,
        accessToken: null,
        message: "Invalid Password!",
      });
    } else {
      Shipper.findOneAndUpdate({
        _id: userId,
        password: bcrypt.hashSync(newPassword, 8),
      }).exec((err, success) => {
        if (err) {
          res.status(500).send({
            success: false,
            message: err,
          });
          return;
        } else {
          return res.status(200).send({
            success: true,
            message: "Success",
          });
        }
      });
    }
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
    Order.find({
      status: { $ne: Constant.ORDER_CONFIRM },
      shipper: userId,
    }).exec((error, order) => {
      res.status(200).send({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          liReviewShipperDTOs: user.liReviewShipperDTOs,
          location: user.location,
          rating: user.rating,
          totalPriceProduct: user.totalPriceProduct,
          totalPriceShipment: user.totalPriceShipment,
          totalPrice: user.totalPrice,
          totalOrder: user.totalOrder,
          haveOrder: order ? true : false,
          description: user.description,
          imgPathAvatar: user.avatarURL,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          birthDate: user.birthDate,
          tokenFireBase: user.tokenFireBase,
          cmnd: user.cmnd,
        },
      });
    });
  });
};

const convertToTime = (date) => {
  date = new Date(date);
  return date.getHours();
};

const handleStatistical = async (listOrder) => {
  const array = Array(24).fill(0);
  let totalShippingFee = 0;
  let totalFoodsFee = 0;
  let totalFee = 0;
  if (listOrder && listOrder.length > 0) {
    await Promise.all(
      await listOrder.map((order) => {
        const completeTimeTypeDate = convertToTime(order.completeTimeTypeDate);
        array.map((item, index) => {
          if (completeTimeTypeDate === index) {
            array[index] += order.shipping_fee;
            totalShippingFee += order.shipping_fee;
            totalFoodsFee += order.goods_fee;
            totalFee += order.total_fee;
          }
        });
      }),
    );
  }
  return { array, totalShippingFee, totalFoodsFee, totalFee };
};

const getStatistical = async (req, res) => {
  const { query, userId } = req;
  let { dateIn } = query;
  let day = new Date();
  Order.find({
    shipper: userId,
    status: Constant.ORDER_COMPLETED,
    completionTime: commonFunction.convertToDate(dateIn ? dateIn : day),
  }).exec(async (err, order) => {
    const temp = await handleStatistical(order);
    const { array, totalShippingFee, totalFoodsFee, totalFee } = temp;
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
      data: {
        dateIn: dateIn || day,
        hour,
        priceShipment: array,
        totalShippingFee,
        totalFoodsFee,
        totalFee,
        totalOrder: order.length,
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
      status: Constant.ORDER_CONFIRM,
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
  } else {
    Order.findOne({ _id: orderId }).exec((err, order) => {
      if (err || !order) {
        return res.status(500).send({
          success: false,
          message: "Đã xảy ra lỗi",
        });
      }
      let { listShipperReject } = order;
      listShipperReject.push(userId);
      Order.findOneAndUpdate({ _id: orderId }, { listShipperReject }).exec(
        (error, response) => {
          if (error) {
            return res.status(500).send({
              success: false,
              message: "Đã xảy ra lỗi",
            });
          }
          return res.status(200).send({
            success: true,
            message: "Đã từ chối đơn hàng",
            data: null,
          });
        },
      );
    });
  }
};

const updateLocationAndStatus = (req, res) => {
  const { body, userId } = req;
  const { location, onGPS } = body;
  Shipper.findOneAndUpdate({ _id: userId }, { location, onGPS }).exec(
    (error, response) => {
      if (error) {
        return res.status(500).send({
          success: false,
          message: error,
          data: null,
        });
      } else {
        return res.status(200).send({
          success: true,
          message: "Update thành công",
          data: {
            onGPS: response.onGPS,
            location: response.location,
          },
        });
      }
    },
  );
};

const updateInformation = (req, res) => {
  const { body, userId } = req;
  const { fullName, birthDate, cmnd, email, avatarURL, description } = body;
  const dataUpdate = {
    fullName,
    birthDate,
    cmnd,
    email,
    avatarURL,
    description,
  };
  Shipper.findOneAndUpdate({ _id: userId }, dataUpdate).exec(
    (err, response) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err,
        });
      }
      res.status(200).send({
        success: true,
        data: null,
      });
    },
  );
};

const saveToken = (req, res) => {
  const { userId, body } = req;
  const { token } = body;
  if (token) {
    Shipper.findOneAndUpdate({ _id: userId }, { tokenFireBase: token }).exec(
      (err, response) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: err,
          });
        } else {
          return res.status(200).send({
            success: true,
            data: response,
          });
        }
      },
    );
  } else {
    return res.status(500).send({
      success: false,
      message: "",
    });
  }
};

module.exports = {
  signUp,
  signIn,
  getInfo,
  getStatistical,
  approvedOrder,
  updateLocationAndStatus,
  updateInformation,
  saveToken,
  resetPassword,
};
