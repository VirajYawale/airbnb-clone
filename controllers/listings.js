const Listing = require("../models/listing");
// radar to extract the coordinate from the location entered
// const Radar = require('radar-sdk-js'); -- radar SDK can user directly in node server 
// so we use axios
const axios = require('axios');
// const maplibregl = require('maplibre-gl');
const map_api_key_radar = process.env.MAP_API_KEY_radar;


module.exports.index = async (req,res) => {  // (/listings) route
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
}

module.exports.new = (req,res) => {  // here if the new route in written below the :id rout the it will treeat new as id (so we will kept it upper)
    // console.log(req.user); // when ever we call the new form this will tell where the user is login and it will give the user info ( so using this info passport(isAuthenticated() will check the user is logged in or not) )
    // we will check if the user is logged in or not if yes then only the new listing form will display...
    // if(!req.isAuthenticated()){
    //     req.flash("error", "You must be logged in to add new listings!");
    //     res.redirect("/login");
    // }
    // we have to do it for each functionality (i.e delete, edit) -- so we will pass it as middleware (refer - middleware.js)
    // extra functionality we can add if the user is not logged in the edit and delete button will not shown...
    res.render("listings/new.ejs"); 
}

module.exports.show = async (req,res,next) => {  // (/listings/:id) route
    try{
        let {id} = req.params;
        // let {title, description, image, price, location, country} = req.body;  ---- this will work when the user enter the data in fields and it will be present in url...
        let listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author" 
                }
            })  // this is nested populate
            .populate("owner"); // populate will show the data in the ejs file
        // populate owner will create access the owner data...
        if(!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            res.redirect("/listings");
        }
        // console.log(listing); this will display all the data in the listings after opening that listing...
        // console.log(listing);
        res.render("listings/show.ejs",{listing});
    }catch (err){
        next(err);
    }
    
}


module.exports.create = async (req,res,next) => { // (/listings) route
    // let {title, description, image, price, location, country} = req.body; ---- this will be the bigger method to do this...
    // let createlisting = Listing.insertOne() -- this will required for the other method
    // to prevent this method index it in the name attribute in the form itself (refer: new.ejs -- name(attribute)).

    // NOTE: from the user side he can't send the empty field in form, BUT IF FROM HOPPSOTCH IF WE PASS EMPTY LISTING THEN THERE SHOULD BE ERROR HANDLING
    // FOR THAT WE WILL:
    // if(!req.body.listing){
    //     throw new ExpressError(500, "Invalid data from listings...");
    // }
    //similarly for the update route...
    // we comment upper part because we handle it in joi below ...

    // IMPORTANT ------------------------------------------------------------------------------------------------------------------
    // this is only done for  overall, but for individual field we have to apply this (otherwise we one can able to pass 
    // the field but can skip the field (ex: price can be skipped using hoppsotch request)) and it can get store without that field 

    // so we have to apply the validation on every field so that with the hoppsotch request can't update the data and store it
    const newListing = new Listing(req.body.listing) // look this will the name attribute in the new.ejs

    // if(!newListing.title){
    //     throw new ExpressError(500, "Title is missing...");
    // }

    // if(!newListing.description){
    //     throw new ExpressError(500, "Description is missing...");
    // }

    // if(!newListing.location){2
    //     throw new ExpressError(500, "Location is missing...");
    // }
    // // and so on

    // but there will be many field so we will type it repeatedly -- so we will use joi.dev (use to validate the schema)

    // refer - https://joi.dev/api/?v=17.13.3
    // now we make the listing schema validation in "schema.js" file and the required in this app.js file
    // NOW ...
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }

// for the geocoding -- to convert location to its coordinate
    // let response = Radar.geocode('New Delhi, India', (err, result) => {
    //     if (!err) {
    //       const loc = result.addresses[0]; // it give only one locaation coordinate related to location
    //       console.log('Latitude:', loc.latitude);
    //       console.log('Longitude:', loc.longitude);
    //     } else {
    //       console.error('Geocode error:', err);
    //     }
    //   });
    //   console.log(response);
    // res.send(done);

    // we not use the upper part beacuse radar SDK can user directly in node server 




    // from this we are getting the coordinates of the entered location
    const response = await axios.get('https://api.radar.io/v1/geocode/forward', { // this is doing forward geocoding
        params: { query: req.body.listing.location },
        headers: {
          Authorization: map_api_key_radar  // your Radar Secret Key
        }
      });
  
      // Extract the first result
    const addresses = response.data.addresses;
  
    // if (addresses && addresses.length > 0) {
    //     const { latitude, longitude } = addresses[0];
  
    //     console.log('Latitude:', latitude);
    //     console.log('Longitude:', longitude);
    //     // here we are getting the coordinates of the enterd location
    // }
    // console.log(addresses[0].geometry)  this will give the geometry parameter which have type and coordinate
    // res.send("done");
      

    // now we will convert it to (Middleware function)... -- function is at starting...
    // validateListing -- Middleare function will be call wherever we need it...

    newListing.owner = req.user._id; // it will add the user when it is creating the new listings -- so that we can display it

    // now we will add the uploaded image link and name
    let url = req.file.path;
    let filename = req.file.filename;
    
    newListing.image = {url, filename}; // this will save the url and filename in image 

    // saving the geometry to the listing
    newListing.geometry = addresses[0].geometry;
    await newListing.save();
    // using connect-flash
    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
}


module.exports.edit = async (req,res) => { // (/listings/:id/edit) route
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", {listing, originalImageUrl});
}


module.exports.update = async (req,res) => { // (/listings/:id) route
    // NOTE: from the user side he can't send the empty field in form, BUT IF FROM HOPPSOTCH IF WE PASS EMPTY LISTING THEN THERE SHOULD BE ERROR HANDLING
    // FOR THAT WE WILL:
    // if(!req.body.listing){
    //     throw new ExpressError(500, "Invalid data from listings...");
    // } --- validation done by validationListing...

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); // -- now first we find the id and the check is it the owner of that listing then we will update it -- 
    // this is for the hoppscotvh requests -- by sending the hopsotch request the form will get display but by click on edit button it will shoe flash error...
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error", "You don't have permission to edit this listings!");
    //     return res.redirect(`listings/${id}`);
    // }

    // we update in the upper part but we have to upload new image for we save it again

    if(typeof req.file !== "undefined"){ // if the new image is aploaded then only we are doing it otherwise not
        // now we will add the uploaded image link and name
        let url = req.file.path;
        let filename = req.file.filename;
        
        listing.image = {url, filename}; // this will save the url and filename in image 

        // then save the listing again
        await listing.save();

    }
    
    // we done this in middleware  -- so that it can be implemented in any of the route...
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}



module.exports.delete = async (req,res) => {  // (/listings/:id) route
    let {id} = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success", "Listing is Deleted!");
    res.redirect("/listings");
}


module.exports.search = async (req, res) => {
    const country = req.query.country;
    // console.log("Country searched:", country);
    // res.send("done");
    const allListings = await Listing.find({})
    res.render("listings/search.ejs", {country, allListings})
}