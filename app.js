if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=3000;

const path= require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")

const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport = require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");






app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));


//const Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
         expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};



app.use(session(sessionOptions))
app.use(flash());

//for authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware for flash and cookies and session

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



//for  handling listing schema server side error ki koi (hopscotch ya postmen se galat data na bhej de)

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
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

//for Handling reviewSchema
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
/*

//Index Route
app.get("/listings",  wrapAsync(async(req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings})
})) 

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})
//create Route

//hamne ejs file me listing[title] is type se likha hai sare fields taki idhar acsess karna easy ho
app.post("/listings",validateListing, wrapAsync(async(req,res,)=>{
     //for error handling
//  let result=listingSchema.validate(req.body);
//  if(result.error){
//     throw new ExpressError(400,result.error);
//  }
const listingData = req.body.listing;
 if (typeof listingData.image === 'string') {
        listingData.image = {
            url: listingData.image,
            filename: "listingimage" // or generate some name
        };
    }

console.log("BODY:", req.body);
     const newListing = new Listing(listingData);
    await newListing.save();
    res.redirect("/listings");
 
}
)
);



//Show Route
app.get("/listings/:id", wrapAsync( async(req,res)=>{
    let {id} = req.params;
    const listing=  await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//Edit Route
app.get("/listings/:id/edit" ,wrapAsync(async(req,res)=>{
   let {id}=req.params;
   const listing = await Listing.findById(id); 
   res.render("listings/edit.ejs",{listing});
}))
//Update Route

app.put("/listings/:id",  wrapAsync(async(req,res)=>{
    let {id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing})
     res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync( async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
*/

//Reviews ko particular listing ko send karne ke liye POST Route

/*
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{

    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
let {id,reviewId}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
 await Review.findByIdAndDelete(reviewId);
 res.redirect(`/listings/${id}`);
}))
*/



// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found!"));
// });


app.use((err,req,res,next)=>{


     let {statusCode=500,message="Something went wrong"}=err;
    
    // res.status(statusCode).send(message);
    // res.send("Something went wrong");
    res.status(statusCode).render("error.ejs",{err})

});

// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "Something went wrong" } = err;
//     res.status(statusCode).render("error.ejs", { err });
// });


app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})
