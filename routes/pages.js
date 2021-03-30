var express=require("express");
var router=express.Router();
var authorise=require("../controllers/authorise");

var app=express();

router.get("/",(req,res)=>{
res.render("index");
});

router.get("/secret",authorise,(req,res)=>{
    res.render("secret");
});

router.get("/sell",authorise,(req,res)=>{
    res.render("sell");
});

router.get("/vehicle",authorise,(req,res)=>{
    res.render("vehicle");
});

router.get("/fashion",authorise,(req,res)=>{
    res.render("fashion");
});

router.get("/electronic",authorise,(req,res)=>{
    res.render("electronic");
});

router.get("/sell",authorise,(req,res)=>{
    res.render("sell");
});

router.get("/register",(req,res)=>{
    res.render("register");
    });


router.get("/login",(req,res)=>{
     res.render("login");
    });

router.get("/logout",authorise,async(req,res)=>{
   try{
        res.clearCookie("jwt");
        console.log("logout successfully...");

        //await req.user.save();
       
        
        res.render('login');

   }catch(err){
       res.status(500).send(error);
   }
});
    

module.exports=router;