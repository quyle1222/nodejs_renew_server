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

  app.post("/order/createOrder", controller.createOrder);

  app.get(
    "/order/getOrderProcessing",
    [authJwt.verifyToken],
    controller.getOrderProcessingOfShipper,
  );

  app.get(
    "/order/getOrderComplete",
    [authJwt.verifyToken],
    controller.getOrderOfShipper,
  );

  app.get(
    "/order/getOrderNonShipper",
    [authJwt.verifyToken],
    controller.getOrderNonShipper,
  );

  app.post(
    "/order/changeStatusOrder",
    [authJwt.verifyToken],
    controller.changeStatusOrder,
  );

   app.get(
     "/order/getDetailOrder",
     [authJwt.verifyToken],
     controller.getDetailOrder,
   );
};
