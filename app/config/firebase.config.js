const admin = require("firebase-admin");

const serviceAccount = require("../root/fiboshipper-firebase-adminsdk-q2fwi-d685ed5a92.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://fiboshipper-default-rtdb.asia-southeast1.firebasedatabase.app",
});

module.exports.admin = admin;
