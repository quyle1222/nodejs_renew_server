const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const config = require("../config/cloudinary.config");

const uploadImage = (req, res, next) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      cloudinary.config(config.dbMedia);
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  const upload = async (req) => {
    let result = await streamUpload(req);
    if (result) {
      result.api_key = null;
      return res.status(200).send({
        message: "Upload success",
        success: true,
        data: result,
      });
    } else {
      return res.status(500).send({
        message: "Upload fail",
        success: false,
      });
    }
  };

  upload(req);
};

module.exports = {
  uploadImage,
};
