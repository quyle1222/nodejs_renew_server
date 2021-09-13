const admin = require("firebase-admin");

const serviceAccount = require("../root/fibocartshipper-323511-firebase-adminsdk-qpm30-765f83fdf5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.admin = admin;
