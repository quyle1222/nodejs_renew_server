const mongoose = require("mongoose");
module.exports = new mongoose.model(
  "Photos.file",
  new mongoose.Schema({
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    filename: String,
    contentType: String,
  }),
);
module.exports = new mongoose.model(
  "Photos.chunk",
  new mongoose.Schema({
    files_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photos.file",
      required: true,
    },
    data: Buffer,
  }),
);
