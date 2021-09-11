const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const { body } = req;
  const { username, password, email, roles } = body;
  const user = new User({
    username,
    email,
    password: bcrypt.hashSync(password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }

    if (roles) {
      Role.find(
        {
          name: { $in: roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({
              success: false,
              message: err,
            });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({
                success: false,
                message: err,
              });
              return;
            }

            res.send({
              success: true,
              message: "User was registered successfully!",
            });
          });
        },
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({
            success: false,
            message: err,
          });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({
              success: false,
              message: err,
            });
            return;
          }

          res.send({
            success: true,
            message: "User was registered successfully!",
          });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  const { body } = req;
  const { username, password } = body;
  User.findOne({
    username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
        });
        return;
      }

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User Not found.",
        });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          success: false,
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      const authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        success: true,
        id: user._id || null,
        username: user.username || null,
        email: user.email || null,
        roles: authorities,
        accessToken: token,
        birthDay: user.birthDay || null,
        phoneNumber: user.phoneNumber || null,
      });
    });
};
