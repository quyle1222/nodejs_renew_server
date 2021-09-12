const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const HomeStay = db.homestay;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getListHomeStay = (req, res) => {
  HomeStay.find().exec((err, response) => {
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

exports.findListHomeStayById = (req, res) => {
  const { query } = req;
  const { userId } = query;

  HomeStay.find({ owner: userId }).exec((err, response) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    if (!userId) {
      res.status(400).send({
        success: false,
        message: "Don't have userId",
      });
      return;
    }
    res.status(200).send({
      listHomeStay: response,
      success: true,
    });
  });
};

exports.createHomeStay = (req, res) => {
  const { userId, body } = req;
  const { nameHomeStay, priceHour, priceDay, city, address } = body;
  const homeStay = new HomeStay({
    nameHomeStay,
    priceDay,
    priceHour,
    city,
    address,
    owner: userId,
  });
  homeStay.save((err, homestay) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    res.status(200).send({
      data: homestay,
      success: true,
    });
  });
};
