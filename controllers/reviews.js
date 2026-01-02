const Listing=require('../models/listing.js'); //model for listings
const Review=require('../models/reviews.js'); //model for reviews


module.exports.createReview=async (req,res)=>{
        const listing=await Listing.findById(req.params.id);
        if(!listing){
            return res.status(404).json({error:"Listing not found"});
        }
        const review=new Review(req.body.review);
        review.author=req.user._id;
        await review.save();

        await Listing.findByIdAndUpdate(req.params.id, {$push: {reviews: review._id}});
        req.flash('success','Successfully made a new review!');
        res.redirect(`/listings/${req.params.id}`);
}

module.exports.deleteReview=async (req,res)=>{
    const {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted the review!');
    res.redirect(`/listings/${id}`);
}