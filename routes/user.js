const express = require("express");
const router = express.Router(); 

// user model

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

// ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER

router.get("/signup", userController.getSignup);

// wrapAsync -- will only display the error(if the user is already registered or not) but it will not redirect to the signup page 
// so we will use try catch
// ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.post("/signup", wrapAsync(userController.postSignup ));


// now login// ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.get("/login", userController.getlogin);


// saveRedirectedUrl - will store the redirecturl in locals -- refer comments in the middleware.js
// ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.post("/login",saveRedirectedUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}) , userController.postlogin)



// now logout
// ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.get("/logout", userController.logout);



module.exports = router;