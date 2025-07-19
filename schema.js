const Joi = require('joi');
// to refer more: refer (https://joi.dev/api/?v=17.13.3)

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        // schema validation...
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0), // minimum value will be 0 -- no negative value allowed...
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null)  // in image url field we can pass null and blackspace becoz we set the default image...
    }).required()
})


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})

