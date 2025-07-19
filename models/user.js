const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose"); 

const userSchema = new Schema({
    // username, hash, salt field will be added by the passport-local-mongoose by default -- so we don't need to add it
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose); // this will add the extra fields as discussed upper...

module.exports = mongoose.model("User", userSchema); // we export the user schema here