const express=require('express');
const router=express.Router();
const multer  = require('multer')
const {storage}=require('../cloudConfig.js'); //cloudinary storage
const upload = multer({ storage }) //for file uploads




const wrapAsync=require("../utils/wrapAsync.js"); //to handle async errors
const {listingScehma,reviewSchema}=require("../schema.js"); //joi schema for listing validation
const ExpressError=require("../utils/ExpressError.js"); //custom error class
const Listing=require('../models/listing.js'); //model for listings
const { isLoggedIn, isOwner } = require('../middleware.js');
const listingController=require('../controllers/listings.js');
const { create } = require('../models/reviews.js');

//converting the joi schema validation into a midddlware and paasing it as an arg in post route
const validatelisting=(req,res,next)=>{
    let {error}=  listingScehma.validate(req.body);//joi for schema validation
        
        if(error){
            throw new ExpressError(400,error);
        }else{
            next();
        }

}

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validatelisting,
        wrapAsync(listingController.createListing));//handled in controller
    


//to show form to create new listing
router.get("/new",isLoggedIn,listingController.newForm); //handled in controller


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner, upload.single('listing[image]'), validatelisting, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));



//index route to display all listings
// router.get('/',wrapAsync(listingController.index)); //handled in controller



//show route to display a single listing
// router.get('/:id',wrapAsync(listingController.showListing));

//crate route to add new listing to database
// router.post('/',isLoggedIn,validatelisting, wrapAsync(listingController.createListing)); //handled in controller

//edit route to show edit form for a listing
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.editForm));

//update route to update a listing 
// router.put('/:id',isLoggedIn,isOwner,validatelisting, wrapAsync(listingController.updateListing));

//delete route to delete a listing
// router.delete('/:id',isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;