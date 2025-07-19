const express = require("express");
const router = express.Router({mergeParams: true});  // this mergeparams use to merge the parent route and child route...
// wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");

// ExpressError
const ExpressError = require("../utils/ExpressError.js");

// joi - listing schema validation
const {reviewSchema} = require("../schema.js");

// aquiring the Listing model ...
const Listing = require("../models/listing.js");

// reviews model
const Review = require("../models/review.js");

// user loggedin authentication middleware
const {isLoogedIn, validatereview, isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js")


// ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER


// posts - reviews
// reviews route
// (/listings/:id/reviews) route  //ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
router.post("/",validatereview,isLoogedIn, wrapAsync(reviewController.addReview ));



//deleting review route   //ALL THE COMMENT REFER FILE IN CONTROLLERS FOLDER
// isLoogedIn check is any one is logged in not a perticular user
router.delete("/:reviewId",isLoogedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;