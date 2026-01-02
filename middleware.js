const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ //check if user is logged index
        req.session.redirecturl = req.originalUrl; //store the url they are requesting
        req.flash('error','You must be logged in');
        return  res.redirect('/login');
    }
    next();
}

module.exports.saveredirectUrl = (req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirectUrl = req.session.redirecturl;
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
     let {id}=req.params;
            let listing=await Listing.findById(id);
            if(!listing || !listing.owner || !req.user || !listing.owner.equals(req.user._id)){
            req.flash('error','Only owners can perform this action!');
            return res.redirect(`/listings/${id}`);
         }
            next();
};

module.exports.isReviewAuthor= async(req,res,next)=>{
     let {id,reviewId}=req.params;
            let review=await Review.findById(reviewId);
            if(!review){
            req.flash('error','Review not found!');
            return res.redirect(`/listings/${id}`);
         }
            if(!review.author || !req.user || !review.author.equals(req.user._id)){
            req.flash('error','You are not the author of this review!');
            return res.redirect(`/listings/${id}`);
         }
            next();
};