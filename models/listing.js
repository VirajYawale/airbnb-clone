const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require('joi');


const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: { // update the schema of image because we want to upload the image
        url: String,
        filename: String,
        // type: String,
        // default means it is undefined ...
        // default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXx%7Cbnww",
        // // if iimage is not uploaded then by  default this will be the image
        // set: (v) => v === "" ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXx%7Cbnww" : v, // ternary operator ...
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId, // here id of reviews will be stored...
            ref: "Review"
        },
    ],
    // owner: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "User"
    //     },
    // ] here we created the multiple owner -- but we want only one owner
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    // category: {
    //     type: String,
    //     enum: ['mountain', 'castle']
    // }  --- for filter (implement it)
});


ListingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews }});
    }
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;