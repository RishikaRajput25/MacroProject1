
const Listing= require("../models/listing");

module.exports.index=async(req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings})
};
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
}
module.exports.showListings=async(req,res)=>{
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
}
module.exports.createListing=async(req,res,)=>{
// let url=req.file.path;
// let filename=req.file.filename;
// console.log(url, "..",filename);
/*
const listingData = req.body.listing;
 if (typeof listingData.image === 'string') {
        listingData.image = {
            url: listingData.image,
            filename: "listingimage" // or generate some name
        };
    }

//console.log("BODY:", req.body);

     const newListing = new Listing(listingData);*/
    // const newListing=new Listing(req.body.listing);



    //just for error 
    console.log("🔥 createListing reached");
    console.log("📦 req.body.listing:", req.body.listing);
    console.log("🖼️ req.file:", req.file);
    
     const listingData = req.body.listing;
    console.log("❌ No listing data received in body");
  // Now Cloudinary image data from multer-storage-cloudinary

 if (!req.file) {
        req.flash("error", "Image is required! Please upload an image.");
        return res.redirect("/listings/new");
    }

  if (req.file) {
    listingData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  } const newListing = new Listing(listingData)
     newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
 
}

module.exports.editListing=async(req,res)=>{
   let {id}=req.params;
   const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.render("/listings");
   }
   let originalImageUrl=listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300,h_200,e_blur:200");
   res.render("listings/edit.ejs",{listing,originalImageUrl});
};
module.exports.updateListings=async(req,res)=>{
    let {id}=req.params;
 
     let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if (typeof req.file != "undefined") {
     let url= req.file.path;
      let filename = req.file.filename;
      listing.image={url,filename};
     await listing.save();
    }
     req.flash("success", " Listing Updated!");
     res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}