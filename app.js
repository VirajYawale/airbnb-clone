if(process.env.NODE_ENV != "production"){ // we only use .env file in the developement phase ot in production phase(i.e after deployment)
    // because we don't have to share this .env file to the other developer
    //WE DON'T HAVE TO UPLOAD THIS .env FILE ON THE GITHUB OR OTHER PLATFORMS
    // dot env
    require('dotenv').config();
    //initially all the credentials are save in .env file but later while deployment we will store it any another place
}


// console.log(process.env.SECRET);  // using this we can access the env file key (process.env.var_name) 


// phase1 (part a) -- Set Up <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const express = require("express")
const app = express();


// ejs and express setup

const path = require("path")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
// to parse the data from url
app.use(express.urlencoded({extended: true}));


// mongoose 
const mongoose = require('mongoose');
const dburl = process.env.ATLASDB_URL;

main().then((res) => {
    console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}


// // aquiring the Listing model ...
// const Listing = require("./models/listing.js");


// method-override
const MethodOverride = require("method-override");
app.use(MethodOverride("_method"));


// Phase 1 ( Part b )  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const ejsMate = require("ejs-mate");  // for styling the ejs page (layouting the page (navbar,footer,etc)) ... 
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");

// Phase 1 ( Part c )
// // wrapAsync
// const wrapAsync = require("./utils/wrapAsync.js");

// ExpressError
const ExpressError = require("./utils/ExpressError.js");


// // joi - listing schema validation
// const {listingSchema , reviewSchema} = require("./schema.js");


// PHASE 2 

// // reviews model
// const Review = require("./models/review.js");


// require the listings route
const listingRouter = require("./routes/listings.js");

// require the reviews route
const reviewRouter = require("./routes/reviews.js");

// require user model
const userRouter = require("./routes/user.js");

// mongo session
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24* 3600 // that is after 24 hrs the session will be updating the change
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
})


// require express-session...
const session = require("express-session");
const sessionOptions = {
    store,
    secret: process.env.SECRET, // this code should be unique(which is not here)
    resave: false,
    saveUninitialized: true, // this two are the exceptions which is handleed here..
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000 , // 7 days 24 hrs 60 mins 60 sec 1000 msec
        // the cookie age will be 7days - after 7 days this cookie will get expire
        // that is for 7 days the user account will be logined - means the login data will be stored for 7days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true // prevent cross-scripting attack
    }
}
app.use(session(sessionOptions));  // to check sessionoption is working -- check the cookie in inspect..


// connect-flash
const flash = require("connect-flash");
app.use(flash());



// passport - for thr user authentication   (this will initialize at the top)
const passport = require("passport");
const LocalStratergy = require("passport-local")
const User = require("./models/user.js")

// we will do all the passport stuff after the creating the session - because in the session all the page should be under one user...

// firstly in passport
app.use(passport.initialize());
app.use(passport.session());// A web application needs the ability to identify users as they browse from page to page. 
// This series of requests and responses, each associated with the same user, is known as a session.

passport.use(new LocalStratergy(User.authenticate())); // use static autheticate method of model in the LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());  // serialie means to store the user login information in the session 
passport.deserializeUser(User.deserializeUser()); // deserialize means to unstore the user login information in the session





// ----------------------------------------------------------------------------------------------------------------------------------


// app.get("/", (req,res) => {
//     res.send("Hi, I am root!");
// })



// middleware for flash and other
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // locals for user - user in navbar.ejs -- if the user is logout then only the user can see the login or signup button
    res.locals.currUser = req.user; // we use the req.user where the passport store the info of user in request
    // it will store the info of the user whose session is on
    next();
})


// Demo User -- only for demo
// app.get("/demouser", async (req,res) => {
//     let fakeuser = new User({
//         email: "xyz@gmail.com",
//         username: "delta-students" // username field is not in userschema though we can add it because of (User.plugin(passportLocalMongoose); -- line in user.js)
//     });
//     let newuser = User.register(fakeuser, "helloworld"); // this is static method in the passport - mongoose (here helloworld is the password)
//     // this register method automatically check the username is unique or not...

//     res.send(newuser);
// })




// all the code having listing route -- code in listings.js
app.use("/listings", listingRouter);


// all the code having review route -- code in reviews.js
app.use("/listings/:id/reviews", reviewRouter); // (/listings/:id/reviews) this is parent route -- other than infronot of this will be the clid route


// all the user router
app.use("/", userRouter);



// if page not fount we redirect on the unknown route then
app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page not Found!")); // this will call to the next(err) with the statueCode and message parameters
})


// this is for wrapAsync
// app.use((err,req,res,next) => {
//     res.send("Something went wrong!");
// });

// for ExpressError
app.use((err,req,res,next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
})


app.listen(8080,() => {
    console.log("Listening the port 8080...");
})