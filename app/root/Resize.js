const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

class Resize {
  constructor(folder) {
    this.folder = folder;
  }

  static filename() {
    return `${Date.now()}.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`);
  }

  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    fs.writeFile(filepath, buffer, (err, part) => {
      if (err) return console.error(err);
      console.log("file saved to ", part.filename);
    });
    return filename;
  }
}

module.exports = Resize;
