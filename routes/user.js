const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveREdirectUrl } = require("../middleware.js");
const usersController = require("../controllers/users.js")
router.route("/signUp").get( usersController.rendersignupForm).post( wrapasync(usersController.signup));
router.route("/login")
.get( usersController.renderloginForm)
// we add middleware passport  where it checks whether required username is exist in data base or not 
.post( saveREdirectUrl, passport.authenticate("local", { failureRedirect: `/login`, failureFlash: true }), usersController.login);
router.get("/logout", usersController.logout);

module.exports = router;