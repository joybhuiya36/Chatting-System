const express = require("express");
const route = express();
const authController = require("../controller/authController");

route.post("/signup", authController.signup);
route.post("/login", authController.login);
// route.post("/forget-password", authController.forgetPassMail);
// route.post("/reset-password", authController.resetPassword);
// route.post("/reset-request", authController.validPasswordResetReq);

module.exports = route;