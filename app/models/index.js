const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require("./user.model");
db.role = require("./role.model");
db.homestay = require("./homestay.model");
db.shipper = require("./shipper.model");
db.order = require("./order.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
