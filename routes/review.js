const express=require("express")
const router= express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");

const Listing= require("../models/listing.js");

const {listingSchema,reviewSchema}=require("../schema.js");
const Review =require("../models/review.js");
const {validateReview, isLoggedIn,isReviewAuthor}= require("../middleware.js")
 const reviewController=require("../controllers/reviews.js");
/*
const validateReview=(req, res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,err)
    }else{
        next();
    }
}
*/
//create review  Route
/*
router.post("/",isLoggedIn,validateReview, wrapAsync(async(req,res)=>{

    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)
}));
*/

router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview))

//Delete Review Route
/*
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
let {id,reviewId}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
 await Review.findByIdAndDelete(reviewId);
 req.flash("success", " Review Deleted!");
 res.redirect(`/listings/${id}`);
}))
*/

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;
