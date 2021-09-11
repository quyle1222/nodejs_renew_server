const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const HomeStay = db.homestay;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getListHomeStay = (req, res) => {
  HomeStay.find({}).exec((err, response) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    res.status(200).send({
      listHomeStay: response,
      success: true,
    });
  });
};
