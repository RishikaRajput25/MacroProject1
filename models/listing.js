const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const Review=require("./review.js");


const listingSchema = new Schema({
title: {
    type: String,
    required:true,
},
description: {
   type:String,
   //required:true,
   
},

image: {
   //type :String,
  filename : String,
  url:String,
  
  //  default: "https://unsplash.com/photos/symmetrical-pattern-of-white-flowers-frames-a-black-space-9LKpsL_LI1M",
  //  set:(v)=> v===""?"https://unsplash.com/photos/symmetrical-pattern-of-white-flowers-frames-a-black-space-9LKpsL_LI1M":v,
},
price:{ 
  type: Number,
  // min:0,
   //required:true,
},
location: {
  type:String,
 // required:true,
},
country: { type :String,
        // required:true,
},
reviews :[
  {
    type:Schema.Types.ObjectId,
    ref:"Review"
  }
],
owner:{
  type:Schema.Types.ObjectId,
  ref:"User",
},
})
//it is an midddleware to delete a review  when a listing is delete
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in : listing.reviews}});
  }
});


const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;