const Resize = require("./../root/Resize");
const path = require("path");

const uploadFile = async (req, res) => {
  const imagePath = path.join(__dirname, "../../public/images");
  const fileUpload = new Resize(imagePath);

  if (!req.file) {
    res.status(401).json({ error: "Please provide an image" });
  }
  console.log(req.file);
  const filename = await fileUpload.save(req.file.buffer);
  return res.status(200).json({ name: filename });
};

module.exports = {
  uploadFile: uploadFile,
};
