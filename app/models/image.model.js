const mongoose = require("mongoose");
module.exports = new mongoose.model(
  "Image",
  new mongoose.Schema({
    name: String,
    desc: String,
    img: {
      data: Buffer,
      contentType: String,
    },
  }),
);
