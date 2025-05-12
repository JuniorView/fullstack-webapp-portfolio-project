const express = require("express");
const router = express.Router();
const doctorsController = require("../controllers/doctorsController");
const verifyToken = require("../middlewares/verifyToken");
const returnStatus = require("../helpers/returnStatus");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

const {
  checkIDNumber,
  checkPhoneNumber,
  checkEmail,
  checkPassword,
  checkUserName,
} = require("../middlewares/checkInputs");

router.post(
  "/registerdoctor",
  verifyToken,
  // Below, ı add a custom middleware, why? Because this /registerdoctor route is very special,we pass form data to this request and the form data will be extracted using the 'formidable' module, formidable helps us to get the multiple form data,if we don't use 'formidable',we can't get the form data because express DOES NOT support form data, so ı extract idnumber,phone,email,username,password via formidable and attach all those to req.body separately because from all the middlewares such as checkIDNumber,checkPhoneNumber,checkEmail,checkUserName,checkPassword ,we need to use the data from the form so we extract each property from the 'req' object from the other middlewares later on.Also remember since incoming data is in a multiple form data, we need to manually convert/parse the JSON into JavaScript object so ı use, JSON.parse
  (req, res, next) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    const form = new formidable.IncomingForm({
      uploadDir: uploadDir,
      //allow 1 Megabyte file size limit, Note: 1 megabyte (MB) = 1048576 bytes = 1024 * 1024
      maxFileSize: 1 * 1024 * 1024,
    });

    // From the frontend,we passed 'file' and 'data' as multiform, formidable gives the form-data via fields parameter and files(like an image) via the files parameter below
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return returnStatus(
          res,
          400,
          true,
          "Error uplaoding file,file limit 1MB"
        );
      }

      // the data we pass from the frontend is in a JSON format so we turn it into JavaScript object
      const formData = JSON.parse(fields.data);

      if (formData) {
        const { idnumber, phone, email, username, password } = formData;

        // We must attach the idnumber, phone, email, username, password to the req object so the other middlewares like checkIDNumber,checkPhoneNumber ... can access these properties from the req object.Remember only formidable module can extract these properties from the request
        req.body.idnumber = idnumber;
        req.body.phone = phone;
        req.body.email = email;
        req.body.username = username;
        req.body.password = password;

        // attach these 2 properties to the req object to use them later on, files.file[0] gives us the first file(image in our case)
        req.uploadedImageFilePath = files.file[0].filepath;
        req.uploadedImageName = files.file[0].originalFilename;

        next();
      } else {
        return returnStatus(res, 400, true, "User data doesn't exist");
      }
    });
  },
  checkIDNumber,
  checkPhoneNumber,
  checkEmail,
  checkUserName,
  checkPassword,
  doctorsController.registerDoctor
);

 router.get("/search",doctorsController.searchDoctor);

 router.post("/updateContact",verifyToken,checkIDNumber,checkEmail,checkPhoneNumber, doctorsController.updateContact);

// Error handling middleware, for this to work make sure to do something like this: return next(new Error()); from other middlewares when error occurs, for example in  checkIDNumber,checkPhoneNumber ... if phonenumber is wrong or username then if we do return next(new Error()); from those middlewares,we can catch the error from below and why do we even do this? There are situations when modules such as formidable saves image to the folder we want and what if we want to get rid of that image later on if something goes wrong? well this is why we create a centralized error-handling middleware below
router.use((err, req, res, next) => {
  if (req.uploadedImageFilePath) {
    // if there is error thrown and there is the uploadedImageFilePath in the req then remove that uploadedImageFilePath, remember formidable module saves the images in a folder we define and in some cases when there is an error, we may want to remove those images/files
    fs.unlink(req.uploadedImageFilePath, (err) => {
      if (err) {
        console.log("Error deleting temporary file", err);
      }
      console.log("File deleted successfully");
    });
  }
  // If other errors are thrown from middlewares such as checkEmail,checkPassword... then we also display those errors via err.message
  console.log("FROM doctors route middleware", err.message);
});

module.exports = router;
