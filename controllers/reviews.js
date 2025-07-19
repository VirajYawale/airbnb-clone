const Listing = require("../models/listing");
const Review = require("../models/review.js");


module.exports.addReview = async (req,res) => { // schema validation, error handling done
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;  // it will check the user is login that will be store in author who will add this

    listing.reviews.push(newReview);  // here we push the review in the listings ...
    await newReview.save();
    await listing.save();  // we had store the review in the listing with the different model review inside the listing...
    console.log("New review added");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}


module.exports.deleteReview = async (req,res) => {  // (/listings/:id/reviews/:reviewId) route
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // this will update the array of reviews
    await Review.findByIdAndDelete(reviewId); // this will delete the review
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}