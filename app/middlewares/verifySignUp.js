const db = require("../models");
const ROLES = db.ROLES;
const Shipper = db.shipper;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  const { body } = req;
  const { username } = body;
  Shipper.findOne({
    username,
  }).exec((err, shipper) => {
    if (err) {
      res.status(500).send({
        message: err,
        success: false,
      });
      return;
    }
    if (shipper) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
        success: false,
      });
      return;
    }
    next();
    // // Email
    // User.findOne({
    //   email,
    // }).exec((err, user) => {
    //   if (err) {
    //     res.status(500).send({ message: err });
    //     return;
    //   }

    //   if (user) {
    //     res.status(400).send({ message: "Failed! Email is already in use!" });
    //     return;
    //   }

    // });
  });
};

checkRolesExisted = (req, res, next) => {
  const { body } = req;
  const { roles } = body;
  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      if (!ROLES.includes(roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${roles[i]} does not exist!`,
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
