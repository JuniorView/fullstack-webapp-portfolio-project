const fs = require("fs");
const path = require("path");

function createImage(req) {
  const uploadDir = path.join(__dirname, "..", "uploads");

  const newPath = path.join(
    uploadDir,
    `${req.body.idnumber}.${path.extname(req.uploadedImageName).slice(1)}`
  );

  // Remember formidable uploads a randomly generated file name which we attached to req.uploadedImageName and we want to rename it to the idnumber of the user so we know that image links to that registered user/doctor
  try {
    fs.renameSync(req.uploadedImageFilePath, newPath);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = createImage;
