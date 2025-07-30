
const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")

const userController=require("../controllers/users.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})



//signup route
/*
router.post("/signup", wrapAsync (async(req,res)=>{
    try{
       let {username, email, password}=req.body;
const newUser=new User({email,username});
  const registeredUser = await User.register(newUser,password);
  console.log(registeredUser);

req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
      req.flash("success","welcome to wanderlust!");
    return res.redirect("/listings");
})
 
    }
catch(e){
req.flash("error",e.message);
res.redirect("/signup");
}
}));
*/

router.post("/signup", wrapAsync (userController.signup))



router.route("/login")
.get(userController.loginGet)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login', failureFlash: true}), userController.loginPost)

//login Route
// login get
/*
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
*/

// router.get("/login",userController.loginGet);

/*
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login', failureFlash: true}),async(req,res)=>{
req.flash("success", "welcome back to wanderlust!")
let redirectUrl=res.locals.redirectUrl || "/listings";

res.redirect(redirectUrl);

})
*/
//login post


// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login', failureFlash: true}), userController.loginPost)

//for Logout
/*
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
})
*/
router.get("/logout",userController.logout);

module.exports=router;