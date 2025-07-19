
const User = require("../models/user.js");


module.exports.getSignup = (req,res) => {
    res.render("./users/signup.ejs");
}

module.exports.postSignup = async (req,res, next) => { // we are making changein database -- so the function will be async
    try{
        let {username, email, password} = req.body; // after signup button is click we extract it from req body...
        // now we will add this field extract from req to the database with the help of schema -- which is required from the model upper
        const newUser = new User({email, username});
        
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => { // after signup it will directly login the user
            if(err) {
                return next();
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });  // this will automatically login the user after signup (i.e creating the user in database) -- we pass registered user info and the callback
        
    }catch (err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
}


module.exports.getlogin = (req,res) => {
    res.render("./users/login.ejs");
}



module.exports.postlogin = async (req,res) => {  // passport.authenticate() -- is the middleware which will check the user authetication -- whether the the user is already signup ... 
    // {failureRedirect: '/login'} -- if the username and password will be not in the database it will redirect to (/login)
    // {failureFlash: true} -- it will flash the msg if the user fails to authenticate...
    req.flash("success", "Welcome to Wanderlust!");
    // res.redirect(res.locals.redirectUrl);

    // IMPORTANT NOTE:
    // NOTE THE PROBLEM: when we are login from the button not by add listing -- then login page... (here after adding page then login page the isloggedIn function is called so the original url is saved in redirected url parameter)
    //                     but here when we click on the login button then isLoggedIn middle is not called so the original url is not saved so the page not found error is popup.

    // so we will first check is the redirectUrl parameter is empty or not -- if empty then redirect "/listtings"
    let redirectedUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectedUrl);
    // this  problem is solved here

    // res.redirect(saveRedirectedUrl); // it is middleware and we have to do it before the login process so we will pass it as middleware
}



module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err){ // this is the cb (call back)
            return next(err); // call next error handling middleware to handle the error
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
}