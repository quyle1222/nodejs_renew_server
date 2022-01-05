const admin = require("firebase-admin");

const serviceAccount = require("../root/fibogroup-955be-firebase-adminsdk-oecu2-59a3de3887.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL:
  //   "https://fiboshipper-default-rtdb.asia-southeast1.firebasedatabase.app",
});

module.exports.admin = admin;
