const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/shipper.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept",
    );
    next();
  });

  app.post(
    "/api/v1/shipper/createShipper",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signUp,
  );

  app.post("/api/v1/shipper/login", controller.signIn);

  app.get(
    "/api/v1/shipper/getShipperInfo",
    [authJwt.verifyToken],
    controller.getInfo,
  );

  app.post(
    "/api/v1/shipper/updateShipper",
    [authJwt.verifyToken],
    controller.updateInformation,
  );

  app.get(
    "/api/v1/shipper/listOrderHistory",
    [authJwt.verifyToken],
    controller.getInfo,
  );

  app.get(
    "/api/v1/shipper/getDetailStatistical",
    [authJwt.verifyToken],
    controller.getStatistical,
  );

  app.post(
    "/api/v1/shipper/approveOrder",
    [authJwt.verifyToken],
    controller.approvedOrder,
  );

  app.post(
    "/api/v1/shipper/updateShipperLocation",
    [authJwt.verifyToken],
    controller.updateLocationAndStatus,
  );
};
