const { admin } = require("../config/firebase.config");
const dbConfig = require("../config/db.config");

const sendNotification = (req, res) => {
  const registrationToken = dbConfig.TOKEN_FIREBASE_DEVICES;
  const message = {
    notification: {
      title: "enter_subject_of_notification_here",
      body: "enter_message_here",
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
      console.log(response);
      res
        .status(200)
        .send({ mess: "Notification sent successfully", success: true });
    })
    .catch((error) => {
      res.status(500).send({ mess: "Notification sent fail", success: false });
    });
};

module.exports = {
  sendNotification,
};
