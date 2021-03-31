var express=require("express");
var router=express.Router();
var authorise=require("../controllers/authorise");
var admin_authorise=require("../controllers/authorise");
var authController=require('../controllers/auth')

var app=express();
var mysql=require("mysql");

var db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});



router.get("/",(req,res)=>{
res.render("index");
});


router.get("/admin_registration",(req,res)=>{
    res.render("admin_registration");
});

router.get("/admin_login",(req,res)=>{
    res.render("admin_login");
});

router.get("/admin_control_update/:id",authController.admin_control_update);

router.get("/admin_control_delete/:id",authController.admin_control_delete);

router.get("/payment/:id",authController.payment);

router.get("/proceed_payment/:id",authController.proceed_payment);

router.get("/update/:id",authController.update);



router.get("/secret",authorise,(req,res)=>{
    res.render("secret");
});

router.get("/sell",authorise,(req,res)=>{
    res.render("sell");
});

router.get("/update",admin_authorise,(req,res)=>{
    res.render("update");
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
     
             // get id of active true
             db.query('SELECT * FROM user WHERE active="true"',async(err,result)=>{
                 if(err){
                     console.log(err);
                 }
             // });
     
     
             //await req.user.save();
             db.query("update user set active='false' where u_id =( " +  result[0].u_id + " )",async(err,result)=>{
                 if(err){
                     console.log(err);
                 }
             });
             
         });
             res.render('login');
     
        }catch(err){
            res.status(500).send(err);
        }
     });
    





module.exports=router;