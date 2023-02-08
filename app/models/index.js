const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.shipper = require("./shipper.model");
db.order = require("./order.model");
db.user = require("./user.model")
module.exports = db;
