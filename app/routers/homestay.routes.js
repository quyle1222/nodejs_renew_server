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
    "/api/get/homestayAll",
    [authJwt.verifyToken],
    controller.getListHomeStay,
  );
  app.post(
    "/api/create/homestay",
    [authJwt.verifyToken],
    controller.createHomeStay,
  );

  ///api/get/homestay?userId=????
  app.get(
    "/api/get/homestay",
    [authJwt.verifyToken],
    controller.findListHomeStayById,
  );
};
