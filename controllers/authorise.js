var jwt=require("jsonwebtoken");

var authorise=async(req,res,next)=>{
    try{
        var token=req.cookies.jwt;
        var verifyUser=jwt.verify(token,process.env.JWT_SECRET);
        console.log(verifyUser);
        next();

    }catch(err){
        res.status(401).send(err);
    }
}


module.exports=authorise;