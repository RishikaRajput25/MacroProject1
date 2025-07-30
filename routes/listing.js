
const express=require("express");
const router= express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const Listing= require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedIn, isOwner,validateListing}= require("../middleware.js")
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})


router
.route("/")
.get(wrapAsync(listingController.index)) 
.post(isLoggedIn ,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))

//new
router.get("/new",isLoggedIn,listingController.renderNewForm);


router
.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListings))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))


/*
const validateListing=(req,res,next)=>{
let {error}=listingSchema.validate(req.body);
 if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
  throw new ExpressError(400,error);
 }
 else{
    next();
 }

}*/
//Index Route
/*
router.get("/",  wrapAsync(async(req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings})
})) 
*/

// router.get("/",  wrapAsync(listingController.index)) ;


//New Route
/*
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
})*/


// router.get("/new",isLoggedIn,listingController.renderNewForm);

//create Route
/*
//hamne ejs file me listing[title] is type se likha hai sare fields taki idhar acsess karna easy ho
router.post("/",validateListing,isLoggedIn , wrapAsync(async(req,res,)=>{

const listingData = req.body.listing;
 if (typeof listingData.image === 'string') {
        listingData.image = {
            url: listingData.image,
            filename: "listingimage" // or generate some name
        };
    }

console.log("BODY:", req.body);
     const newListing = new Listing(listingData);
     newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
 
}
)
);
*/

// router.post("/",validateListing,isLoggedIn , wrapAsync(listingController.createListing))

//Show Route
/*
router.get("/:id", wrapAsync( async(req,res)=>{
    let {id} = req.params;
    const listing=  await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}))
*/

// router.get("/:id", wrapAsync(listingController.showListings))

//Edit Route
/*
router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
   let {id}=req.params;
   const listing = await Listing.findById(id); 
   res.render("listings/edit.ejs",{listing});
}))*/

router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingController.editListing))

//Update Route
/*
router.put("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
 
     await Listing.findByIdAndUpdate(id,{...req.body.listing})
     req.flash("success", " Listing Updated!");
     res.redirect(`/listings/${id}`);
}));
*/

// router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateListings))

//Delete Route
/*router.delete("/:id", isLoggedIn,isOwner,wrapAsync( async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));*/
 
// router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

module.exports=router;






