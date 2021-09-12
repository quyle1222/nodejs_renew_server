const { authJwt } = require("../middlewares");
const controller = require("../controllers/homestay.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept",
    );
    next();
  });
  app.get(
    "/api/get/homestay",
    [authJwt.verifyToken],
    controller.getListHomeStay,
  );
};
