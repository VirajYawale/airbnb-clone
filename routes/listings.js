const express = require("express");
const router = express.Router();
// wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");

// ExpressError
const ExpressError = require("../utils/ExpressError.js");

// joi - listing schema validation
const {listingSchema} = require("../schema.js");

// aquiring the Listing model ...
const Listing = require("../models/listing.js");

// user loggedin authentication middleware
const {isLoogedIn, isOwner, validateListing} = require("../middleware.js");
const { authorize } = require("passport");


// route functionality import form the controller
const listingsController = require("../controllers/listings.js");


// multer to store the file from the form
const multer  = require('multer')
// storage from cloudConfig.js
const {storage} = require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' }) // Temporary we will save the file in the upload folder
const upload = multer({ storage }); // now multer will storge the data in the cloudinary storage...


// ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER


// using router.route we can shorten the length of this code
// router
//     .route("/")
//     .get(wrapAsync(listingsController.index))
//     .post(validateListing ,isLoogedIn, wrapAsync(listingsController.create ));

// this is how we can combine the same route paths ... 



//index route  // ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.get("/", wrapAsync(listingsController.index));



// search
router.get("/search", listingsController.search);


// NOTE: WHENEVER WE ARE REFERSHING THE SERVER THE USER IS GETING LOGGED OUT! -- IT IS LOGGED FOR THAT SESSION

// new route  // (/listings/new) route // ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.get("/new", isLoogedIn , listingsController.new);


// showing details route  // ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.get("/:id", wrapAsync(listingsController.show ));



// create route  ---- having important comments  // ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
//upload.single('listing[image]') -- will multer the file in cloud storage
router.post("/" ,isLoogedIn,upload.single('listing[image]'),validateListing,  wrapAsync(listingsController.create ));
// router.post("/",upload.single('listing[image]'), (req, res) => { 
//     // using this upload.single('listing[image]') -- we are saving the image in the folder uploades (but we have to upload it in DB as URL) -- with the help of multer
//     res.send(req.file);  // now the image is store in local directory, but we have to upload it on the cloud
//     // so we are using (cloudinary)
// });


// edit route  // ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.get("/:id/edit",isLoogedIn,isOwner, wrapAsync(listingsController.edit ));

// update route -- first it will check is the user is login and the then is the user is owner...  // ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.put("/:id",isLoogedIn, isOwner,upload.single('listing[image]'),validateListing , wrapAsync(listingsController.update ));


// delete route  // ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.delete("/:id",isLoogedIn, isOwner, wrapAsync(listingsController.delete ));


module.exports = router;