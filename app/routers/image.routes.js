const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image.controller");

let routes = (app) => {
  router.get("/read", imageController.home);
  router.post("/upload", imageController.uploadFile);
  return app.use("/", router);
};
module.exports = routes;
