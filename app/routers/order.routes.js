const { authJwt } = require("../middlewares");
const controller = require("../controllers/order.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept",
    );
    next();
  });

  app.post("/api/v1/createOrder", controller.createOrder);

  app.get(
    "/api/v1/getOrderProcessing",
    [authJwt.verifyToken],
    controller.getOrderProcessingOfShipper,
  );

  app.get(
    "/api/v1/getOrderComplete",
    [authJwt.verifyToken],
    controller.getOrderOfShipper,
  );

  app.get(
    "/api/v1/getOrderNonShipper",
    [authJwt.verifyToken],
    controller.getOrderNonShipper,
  );

  app.post(
    "/api/v1/changeStatusOrder",
    [authJwt.verifyToken],
    controller.changeStatusOrder,
  );

   app.get(
     "/api/v1/getDetailOrder",
     [authJwt.verifyToken],
     controller.getDetailOrder,
   );
};
