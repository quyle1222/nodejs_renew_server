const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require("./user.model");
db.role = require("./role.model");
db.homestay = require("./homestay.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
