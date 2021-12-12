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
    "/shipper/createShipper",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signUp,
  );

  app.post("/shipper/login", controller.signIn);

  app.post(
    "/shipper/resetPassword",
    [authJwt.verifyToken],
    controller.resetPassword,
  );

  app.post("/shipper/saveToken", [authJwt.verifyToken], controller.saveToken);

  app.get("/shipper/getShipperInfo", [authJwt.verifyToken], controller.getInfo);

  app.post(
    "/shipper/updateShipper",
    [authJwt.verifyToken],
    controller.updateInformation,
  );

  app.get(
    "/shipper/listOrderHistory",
    [authJwt.verifyToken],
    controller.getInfo,
  );

  app.get(
    "/shipper/getDetailStatistical",
    [authJwt.verifyToken],
    controller.getStatistical,
  );

  app.post(
    "/shipper/approveOrder",
    [authJwt.verifyToken],
    controller.approvedOrder,
  );

  app.post(
    "/shipper/updateShipperLocation",
    [authJwt.verifyToken],
    controller.updateLocationAndStatus,
  );
};
