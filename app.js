var express=require("express");
var app=express();
var mysql=require("mysql");
var path=require("path");
var dotenv=require("dotenv");
dotenv.config({path:'./.env'})
var authorise=require("./controllers/authorise");

var fileUpload=require("express-fileupload");
app.use(fileUpload());


var publisher_key="pk_test_51IVTxzBhCT93sd8cEIBthSJL3WO9vGWXypfIfGII4zGIEydAYAuW9j8uhQl9eglbeZ1A4LhaiFhRJOpnEkw4Ic4z00bVt9cAi2";
var secret_key="sk_test_51IVTxzBhCT93sd8cDMUSo4eKE2huEamIUF8fnfDsKm6XIywMFjHSuGleIRYP3DuhHZCaNcaysqrPwzUz8jOWjIbP00fTzhwEfM";

//var bodyParser=require("body-parser");
var cookieParser=require('cookie-parser');

//for grabbing data in any forms from html page
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());


//define routes
app.use('/', require('./routes/pages'));
app.use('/auth',require('./routes/auth'));


var db=mysql.createConnection({ 
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

var publicDirectory=path.join(__dirname,'./public');
app.use(express.static(publicDirectory));





app.set("view engine","hbs");


db.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("mysql connected...");
    }
})

app.listen(3000,()=>{
    console.log("server started...");
});