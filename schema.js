const Joi = require("joi");
const joi=require("joi");

module.exports.listingScehma=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        category:Joi.string().valid('Trending', 'Top Rated', 'Rooms', 'Iconic Cities', 'Mountains', 'Pools', 'Castles', 'Forest', 'Skiing', 'Play').required(),
        image:Joi.string().allow("",null).optional()
    }).required()
});

// schema to validate incoming review payloads
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
});