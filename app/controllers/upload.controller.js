const Resize = require("./../root/Resize");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const config = require("../config/cloudinary.config");

const uploadFile = async (req, res, next) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
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
  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
  }
  upload(req);
};

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

  async function upload(req) {
    let result = await streamUpload(req);
    if (result) {
      return res.status(200).j;
    }
  }

  upload(req);
};

module.exports = {
  uploadFile,
  uploadImage,
};
