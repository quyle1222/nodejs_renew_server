const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/order.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept",
    );
    next();

    app.post("/api/v1/createOrder", controller.createOrder);
  });
};
