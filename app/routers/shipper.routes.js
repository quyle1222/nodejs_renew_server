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
    "/api/v1/shipper/signUp",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signUp,
  );
  app.post("/api/v1/shipper/signIn", controller.signIn);
  app.get("/api/v1/shipper/getInfo", authJwt.verifyToken, controller.getInfo);
  app.get(
    "/api/v1/shipper/listOrderHistory",
    authJwt.verifyToken,
    controller.getInfo,
  );
  app.get(
    "/api/v1/shipper/getStatistical",
    authJwt.verifyToken,
    controller.getStatistical,
  );
};
