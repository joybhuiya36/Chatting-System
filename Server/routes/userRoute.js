const express = require("express");
const route = express();
const userController = require("../controller/userController");
const { authentication } = require("../middleware/auth");

route.get("/all/", authentication, userController.getAllUser);
route.get("/search/:user", authentication, userController.getSelectedUser);

module.exports = route;
