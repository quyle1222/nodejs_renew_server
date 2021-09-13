const controller = require("../controllers/upload.controller");
const { authJwt } = require("../middlewares");
const upload = require("./../middlewares/upload");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept",
    );
    next();
  });
  app.post("/api/upload/image", upload.single("file"), controller.uploadImage);
};
