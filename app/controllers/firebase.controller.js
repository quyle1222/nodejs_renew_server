const { admin } = require("../config/firebase.config");
const dbConfig = require("../config/db.config");

const sendNotification = (req, res) => {
  const registrationToken = dbConfig.TOKEN_FIREBASE_DEVICES;
  const message = {
    data: { score: "850", time: "2:45" },
    notification: {
      title: "Chúc mừng",
      body: "Bạn đã có đơn hàng mới",
    },
  };
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };

  admin
    .messaging()
    .sendToDevice(registrationToken, message, options)
    .then((response) => {
      res
        .status(200)
        .send({ mess: "Notification sent successfully", success: true });
    })
    .catch((error) => {
      res.status(500).send({ mess: "Notification sent fail", success: false });
    });
};

const sendOrder = (token, order) => {
  const registrationToken = token;
  const message = {
    data: {
      orderId: order._id.toString(),
    },
    notification: {
      title: "Chúc mừng",
      body: "Bạn đã có đơn hàng mới",
    },
  };
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };
  try {
    admin
      .messaging()
      .sendToDevice(registrationToken, message, options)
      .then((res) => {
      });
  } catch (error) {}
};

module.exports = {
  sendNotification,
  sendOrder,
};
