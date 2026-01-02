const express=require('express');
const router=express.Router({mergeParams: true}); //to access params from parent router

const wrapAsync=require("../utils/wrapAsync.js"); //to handle async errors
const {reviewSchema}=require("../schema.js"); //joi schema for review validation
const ExpressError=require("../utils/ExpressError.js"); //custom error class
const Review=require('../models/reviews.js'); //model for reviews
const Listing=require('../models/listing.js'); //model for listings
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController=require('../controllers/reviews.js');



//middleware to validate review data using joi schema
const validateReview=(req,res,next)=>{
    let {error}=  reviewSchema.validate(req.body);//joi for schema validation   
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


//create review for a listing
router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//delete review for a listing
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports=router;