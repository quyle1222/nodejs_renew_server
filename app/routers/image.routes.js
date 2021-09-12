const { authJwt } = require("../middlewares");
const controller = require("../controllers/image.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
    );
    next();
  });
  app.post("/api/upload/image", [authJwt.verifyToken], controller.updateImage);
};
