var mysql=require("mysql");
var jwt=require("jsonwebtoken");
var bcrypt=require('bcryptjs');
//global.my_id;
var nodemailer = require('nodemailer');

var db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vivekvirendra4@gmail.com',
      pass: 'killedar123'
    }
  });


  var mailOptions_1 = {
    from: 'vivekvirendra4@gmail.com',
    to: ('prashant.dilpak16@gmail.com'),
    subject: 'upload successfull',
    text: `product uploaded successfull on second_hand_mall`
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
  };


  var mailOptions_2 = {
    from: 'vivekvirendra4@gmail.com',
    to: ('prashant.dilpak16@gmail.com'),
    subject: 'order placed',
    text: `congratulations, order placed successfull`
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
  };

  var mailOptions_3 = {
    from: 'vivekvirendra4@gmail.com',
    to: ('prashant.dilpak16@gmail.com'),
    subject: 'Registered...',
    text: `registered success on second_hand_mall.com`
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
  };




var publisher_key="pk_test_51IVTxzBhCT93sd8cEIBthSJL3WO9vGWXypfIfGII4zGIEydAYAuW9j8uhQl9eglbeZ1A4LhaiFhRJOpnEkw4Ic4z00bVt9cAi2";
var secret_key="sk_test_51IVTxzBhCT93sd8cDMUSo4eKE2huEamIUF8fnfDsKm6XIywMFjHSuGleIRYP3DuhHZCaNcaysqrPwzUz8jOWjIbP00fTzhwEfM";
var stripe=require("stripe")(secret_key)

exports.login=async(req,res)=>{
    try{
        var {email,password}=req.body;
        if(!email || !password){
            return res.status(400).render('login',{
                message:'please provide an email and password'
            })
        }

        db.query('SELECT * FROM user WHERE email=?',[email],async(err,result)=>{
            //if(!result || !(await bcrypt.compare(password,result[0].password)))
            console.log(result);
            if(!result || !(await bcrypt.compare(password,result[0].password))){
                res.status(401).render('login',{
                    message:'the email or the password is incorrect'
                })
            }
            else{
                var id=result[0].u_id;
                //***************** ye my_id niche add kiya tha ***************** */
                //my_id=result[0].id;
                //console.log(my_id);
                var token=jwt.sign({id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                });

                console.log("the token is"+token);

                const cookieOptions={
                    expires:new Date(
                        Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly:true
                }
                res.cookie('jwt',token,cookieOptions);

                var userVer=await jwt.verify(token,process.env.JWT_SECRET);
                console.log(userVer);
                //res.status(200).redirect("/");

                db.query("update user set active='true' where u_id =( " +  result[0].u_id + " )",async(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                });




                res.status(200).render('secret');
            }

        });

    }catch(err){
        console.log(err);
    }
}



exports.register=(req,res)=>{
    console.log(req.body);
    
var name=req.body.name;
var email=req.body.email;
var password=req.body.password;
var passwordconfirm=req.body.passwordconfirm;
var address=req.body.address;
var phone=req.body.phone;
var aadhar=req.body.aadhar;


// var {name,email,password,passwordconfirm}=req.body;


db.query('select email from user where email=?',[email],async(err,result)=>{
    if(err){
        console.log(err);
    }
    
    if(result.length>0){
        return res.render('register',{
            message:'that email is already in use'
        })
    }
    else if(password!==passwordconfirm){
        return res.render('register',{
            message:'passwords do not match'
        })
    }


    var hashedPassword=await bcrypt.hash(password,8);
    console.log(hashedPassword);

    db.query('INSERT INTO user SET ?',{u_name:name,email:email,password:hashedPassword,address:address,phone:phone,aadhar:aadhar,active:"false"},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
            return res.render('register',{
                message:'user registered'
            })
        }
    })

});


    //res.send("form submited");

    transporter.sendMail(mailOptions_3, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      



};



exports.sell=(req,res)=>{

    var image;
    var uploadPath;

    if(!req.files || Object.keys(req.files).length===0){
        return res.status(400).send("no files were uploaded.");
    }

    image=req.files.image;
    var image_name=image.name;
    var p_category=req.body.p_category;
    var p_name=req.body.p_name;
    var price=req.body.price;
    var description=req.body.description;

    console.log(image,p_category,p_name,price,description);
    image.mv('public/images/upload_images/'+image.name,function(err){
        if(err) return res.status(500).send(err);

        //iske andar mysql wala insert code likho
        var sql = "INSERT INTO `product`(`p_name`,`category`,`price`,`image`, `description`) VALUES ('" + p_name + "','" + p_category + "','" + price + "','" + image_name + "','" + description + "')";
    						var query = db.query(sql, function(err, result) {
                        if(err){
                           console.log(err);
                       }else{
                           console.log(result);
                           return res.render('sell',{
                            message:'product uploaded'
                        })
                          // return res.redirect('profile/'+result.insertId)
                       }
    							 //res.redirect('profile/'+result[0].insertId);
    						});
                            
                    

    });


     
 //selling table ka code

 db.query('SELECT * FROM user WHERE active="true"',async(err,u_result)=>{
    if(err){
        console.log(err);
        }

        db.query('select * from product where p_name=?',[p_name],async(err,p_result)=>{
            if(err){
            console.log(err);
            }

            db.query('INSERT INTO selling SET ?',{u_id:u_result[0].u_id,p_id:p_result[0].p_id,status:"true"},(err,result)=>{
                if(err){
                    console.log(err);
                }
            }); //selling part  

            db.query('INSERT INTO cart SET ?',{u_id:u_result[0].u_id,p_id:p_result[0].p_id},(err,result)=>{
                if(err){
                    console.log(err);
                }
            }); //selling wala



        });//p_id wala

    });//active:true


    transporter.sendMail(mailOptions_1, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

           
   

}// sell export part


exports.get_electronic=(req,res)=>{

    db.query("SELECT * FROM product where category='electronics'", function (err, result) {
        if (err) throw err;
        //console.log(result);

        res.render('electronic',{result});

      });


      

}

exports.get_fashion=(req,res)=>{

    db.query("SELECT * FROM product where category='fashion'", function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.render('fashion',{result});
      });
    
}


exports.get_vehicle=(req,res)=>{
    
    db.query("SELECT * FROM product where category='vehicle'", function (err, result) {
        if (err) throw err;
       // console.log(result);
       res.render('vehicle',{result});
      });

}


exports.proceed_payment=(req,res)=>{

    var product_id=req.params.id;
    console.log("product to buy ==> "+ product_id);
   
    res.render('payment',{
        key: publisher_key
    });

    
//selling table code

db.query('SELECT * FROM user WHERE active="true"',async(err,u_result)=>{
    if(err){
        console.log(err);
        }

        db.query('select * from product where p_id=?',[product_id],async(err,p_result)=>{
            if(err){
            console.log(err);
            }

            db.query('INSERT INTO bought SET ?',{u_id:u_result[0].u_id,p_id:p_result[0].p_id},(err,result)=>{
                if(err){
                    console.log(err);
                }
            });   
            
            db.query('INSERT INTO cart SET ?',{u_id:u_result[0].u_id,p_id:p_result[0].p_id},(err,result)=>{
                if(err){
                    console.log(err);
                }
            }); 




        });

    });//active:true


    db.query("update selling set status='false' where p_id =( " +  product_id + " )",async(err,result)=>{
        if(err){
            console.log(err);
        }
    });


    db.query("delete from product where p_id =( " +  product_id + " )",async(err,result)=>{
        if(err){
            console.log(err);
        }
    });


    //res.render('payment');
    //res.render('payment/:product_id');

}


exports.payment=(req,res)=>{
    
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:"shivkar jamakhandi",
        address:{
            line1:'attar nagar',
            postal_code:'413008',
            city:'solapur',
            state:'maharashtra'
        }
    }).then((customer)=>{
        return stripe.charges.create({
            amount:3000,
            description:"second_hand_mall",
            currency:'INR',
            customer:customer.id
        })
    }).then((charge)=>{
        console.log(charge);
        //res.send("success");
        res.render('payment_success');
    }).catch((err)=>{
        res.send(err);
    })
    //res.render('payment_success');

transporter.sendMail(mailOptions_2, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    




}


exports.admin_register=(req,res)=>{
    console.log(req.body);
    
var name=req.body.name;
var email=req.body.email;
var password=req.body.password;
var passwordconfirm=req.body.passwordconfirm;
var phone=req.body.phone;



// var {name,email,password,passwordconfirm}=req.body;


db.query('select email from admin where email=?',[email],async(err,result)=>{
    if(err){
        console.log(err);
    }
    
    if(result.length>0){
        return res.render('register',{
            message:'that email is already in use'
        })
    }
    else if(password!==passwordconfirm){
        return res.render('register',{
            message:'passwords do not match'
        })
    }


    var hashedPassword=await bcrypt.hash(password,8);
    console.log(hashedPassword);

    db.query('INSERT INTO admin SET ?',{name:name,password:hashedPassword,phone:phone,email:email},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
            return res.render('register',{
                message:'user registered'
            })
        }
    })

});


    //res.send("form submited");
};



exports.admin_login=async(req,res)=>{
    try{
        var {email,password}=req.body;
        if(!email || !password){
            return res.status(400).render('login',{
                message:'please provide an email and password'
            })
        }

        db.query('SELECT * FROM admin WHERE email=?',[email],async(err,result)=>{
            //if(!result || !(await bcrypt.compare(password,result[0].password)))
            console.log(result);
            if(!result || !(await bcrypt.compare(password,result[0].password))){
                res.status(401).render('login',{
                    message:'the email or the password is incorrect'
                })
            }
            else{
                var id=result[0].a_id;
                //***************** ye my_id niche add kiya tha ***************** */
                //my_id=result[0].id;
                //console.log(my_id);
                var token=jwt.sign({id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                });

                console.log("the token is"+token);

                const cookieOptions={
                    expires:new Date(
                        Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly:true
                }
                res.cookie('admin_jwt',token,cookieOptions);

                var userVer=await jwt.verify(token,process.env.JWT_SECRET);
                console.log(userVer);
                //res.status(200).redirect("/");

                console.log("admin login successfully...");


                db.query("SELECT * FROM product", function (err, result) {
                    if (err) throw err;
                    //console.log(result);
            
                   res.render("admin",{result});
            
                  });
                
                

                //res.status(200).render('secret');
            }

        });

    }catch(err){
        console.log(err);
    }
}

exports.admin_control_update=(req,res)=>{

var product_id=req.params.id;

res.render('update',{product_id});


}

exports.admin_control_delete=(req,res)=>{

var product_id=req.params.id;

db.query("delete from product where p_id=?",[product_id], function (err, result) {
    if (err) throw err;
    //console.log(result);

    res.send("product deleted successfully");

  });

}



exports.update=(req,res)=>{
var product_id=req.params.id;
var image;

// if(!req.files || Object.keys(req.files).length===0){
//     return res.status(400).send("no files were uploaded.");
// }
console.log("product_id======>"+product_id);

image=req.files.image;
var image_name=image.name;
var p_category=req.body.p_category;
var p_name=req.body.p_name;
var price=req.body.price;
var description=req.body.description;
//



image.mv('public/images/upload_images/'+image.name,function(err){
    if(err) return res.status(500).send(err);

//
db.query('update product SET price=?, description=?,image=?, p_name=?, category=? where p_id=?',[price,description,image_name,p_name,p_category,product_id],(err,result)=>{
    if(err){
        console.log(err);
    }else{
        console.log(result);
        return res.render('update',{
            message:'product updated'
        })
    }
})
//

});

}


exports.cart=(req,res)=>{


    db.query('SELECT * FROM user WHERE active="true"',async(err,u_result)=>{
        if(err){
            console.log(err);
            }

            db.query('SELECT p_id FROM selling WHERE u_id=?',[u_result[0].u_id],async(err,selling)=>{
                if(err){
                    console.log(err);
                    }

                    db.query('SELECT p_id FROM bought WHERE u_id=?',[u_result[0].u_id],async(err,bought)=>{
                        if(err){
                            console.log(err);
                        }
                        
                        db.query('SELECT * FROM product WHERE p_id=?',[selling[0].u_id],async(err,sell_product)=>{
                            if(err){
                                console.log(err);
                            }

                            db.query('SELECT * FROM product WHERE p_id=?',[bought[0].u_id],async(err,bought_product)=>{
                                if(err){
                                    console.log(err);
                                }
                        
                                res.render('cart',{sell_product,bought_product});

                            });//bought_product
                        });//sell_product

      
        
            });//bought
         });//selling
    });//active user





}
