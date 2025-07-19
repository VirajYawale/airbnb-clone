
// requireing the listing model
const Listing = require("./models/listing.js");

// ExpressError
const ExpressError = require("./utils/ExpressError.js");

// joi - listing schema validation
const {listingSchema} = require("./schema.js");


// joi - listing schema validation
const {reviewSchema} = require("./schema.js");


// requiring the listing model
const Review = require("./models/review.js")



// schema validation Middleware function ----------------------
// listing schema
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}


// schema validation Middleware function ----------------------
//review schema
module.exports.validatereview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}



// NOTE: IN THE MIDDLEWARE USE RETURN AS NEEDED...

module.exports.isLoogedIn = (req,res, next) => {
    if(!req.isAuthenticated()){

        // saving the redirecting url -- post signups
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in to add new listings!");
        return res.redirect("/login");
    }
    next(); // ❌ this line should be inside the `else` block or there should be return in if block
    // This next() always runs, even when the user is not authenticated — that’s the root cause of the review being deleted without a logged-in user.
}

// after the use is login then the session get reset so the redirectedUrl will get deleted so in following we store it in the locals

module.exports.saveRedirectedUrl = (req,res,next) => { // after the user login, if there is any redirect url it will store in the locals so that we can use it any where
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error", "You are not the owner of this listing!");
    //     return res.redirect(`/listings/${id}`);
    // } ---- this will give the error -- when noone is login the locals will be undefined and the server get crashed
    //  so we have to also check whether the use in login or not (i.e currUser)

    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}











// there is error in delete review -- after clicking delete the review is get delete even after the user is not login