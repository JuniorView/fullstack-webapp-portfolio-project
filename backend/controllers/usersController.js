const bcrypt = require("bcrypt");
const { getDatabase, client } = require("../helpers/connectDB");
const signToken = require("../helpers/signToken");
const returnStatus = require("../helpers/returnStatus");
const fs = require("fs");
const path = require("path");

const usersController = {
  signIn: async (req, res) => {
    try {
      const db = await getDatabase();
      var user = null;
      console.log(req.body);

      // check if the email is the admin email, or doctor email, because only admin or doctor can sign in
      const admin = await db.collection("admin").findOne({
        email: req.body.email,
      });

      const doctor = await db.collection("doctors").findOne({
        email: req.body.email,
      });

      if (!admin && !doctor) {
        return returnStatus(res, 404, true, "Not found");
      }

      if (admin) {
        user = admin;
      }
      if (doctor) {
        user = doctor;
      }

      // Compare passwords,password is what is sent to the server and user.password is the hashed password from the database
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err || !result) {
          return returnStatus(res, 401, true, "Invalid email or password");
        }

        //Generate JWT
        const newjwt = signToken({
          email: user.email,
        });

        //send token
        return returnStatus(res, 200, false, `Welcome ${user.username}`, {
          token: newjwt,
          username: user.username,
        });
      });
    } catch (error) {
      console.log(error);
      return returnStatus(res, 500, true, "Internal server error");
    } finally {
      if (client) {
        await client.close();
      }
    }
  },
  checkifLoggedIn: async (req, res) => {
    try {
      const db = await getDatabase();

      // remember decodedtoken is coming from verifyToken middleware,
      const admin = await db.collection("admin").findOne({
        email: req.decodedtoken.email,
      });

      // check if this user is admin, if yes,send admin:true object
      if (admin) {
        return returnStatus(res, 200, false, "ok", {
          admin: true,
        });
      }

      const doctor = await db.collection("doctors").findOne({
        email: req.decodedtoken.email,
      });

      // check if this user is doctor, if yes,send doctor:true object
      if (doctor) {
        const uploadsDir = path.join(__dirname, "/../uploads");
        var image = null;

        const files = await fs.promises.readdir(uploadsDir);

        // Find the file with the corresponding user ID, regardless of extension
        const imageFile = files.find((file) =>
          file.startsWith(doctor.idnumber)
        );

        var base64Image = "";

        if (imageFile) {
          // Read the image file
          const imagePath = path.join(uploadsDir, imageFile);
          image = fs.readFileSync(imagePath);

          // Convert the image to base64
          base64Image = Buffer.from(image).toString("base64");
        }
        return returnStatus(res, 200, false, "Ok", {
          image: base64Image,
          doctor: true,
          idnumber: doctor.idnumber,
          phone: doctor.phone,
          email: doctor.email,
          username: doctor.username,
        });
      } else {
        return returnStatus(res, 401, true, "Unauthorized");
      }
    } catch (error) {
      console.log(error);
      return returnStatus(res, 500, true, "Internal server error");
    } finally {
      if (client) {
        await client.close();
      }
    }
  },
};

module.exports = usersController;
