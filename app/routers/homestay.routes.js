const { authJwt } = require("../middlewares");
const controller = require("../controllers/homestay.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept",
    );
    next();
  });

  app.get(
    "/api/v1/get/homestayAll",
    [authJwt.verifyToken],
    controller.getListHomeStay,
  );
  app.post(
    "/api/v1/create/homestay",
    [authJwt.verifyToken],
    controller.createHomeStay,
  );
  ///api/get/homestay?userId=????
  app.get(
    "/api/v1/get/homestay",
    [authJwt.verifyToken],
    controller.findListHomeStayById,
  );
};
