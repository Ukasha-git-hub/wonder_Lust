const joi = require("joi");
const review = require("./models/review");
module.exports.listingschema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().allow("", null),
        price: joi.number().required(),
        country: joi.string().required(),
        location: joi.string().required(),
    }).required(),
});
module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().pattern(/[a-zA-Z]/).required()
    }).required(),
})