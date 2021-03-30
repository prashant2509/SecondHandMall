var express=require("express");
var router=express.Router();
var authController=require('../controllers/auth')
router.post("/register",authController.register);

router.post("/login",authController.login);

router.post("/sell",authController.sell);

router.post("/electronic",authController.get_electronic);

router.post("/fashion",authController.get_fashion);

router.post("/vehicle",authController.get_vehicle);

router.post("/proceed_payment",authController.proceed_payment);

router.post("/payment",authController.payment);

router.post("/admin_register",authController.admin_register);

router.post("/admin_login",authController.admin_login);

router.post("/update",authController.update);

module.exports=router; 
