const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyToken = require("../middlewares/verifyToken");

const { checkEmail, checkPassword } = require("../middlewares/checkInputs");

router.post("/signin", checkEmail, checkPassword, usersController.signIn);

//  checkifloggedin route is protected so only users who have the token that contains admin or doctor email in it can access the adminpanel page or register user
router.get("/checkifloggedin", verifyToken, usersController.checkifLoggedIn);

router.use((err, req, res, next) => {
  // if there is error thrown from any middlewares such as checkEmail,checkPassword,checkPhoneNumber... this middleware runs and we see the error from the backend, if you just display err, we get the stack trace(where the error is coming from) and if you do err.message,we get the exact error
  console.log("from users route middleware", err.message);
});

module.exports = router;
