const jwt = require('../services/JWTService')
const User=require('../models/user')
const userDTO=require('../dto/user')

const auth = async(req , res , next)=>{
    
    const refreshToken = req.cookies?.refreshToken;
    const accessToken = req.cookies?.accessToken;

    if(!refreshToken || !accessToken){
        const error={
            status:401,
            message:'Unauthorized'
        }
        return next(error)
    }
    let _id;

    try {
        _id=jwt.verifyAccessToken(accessToken)._id;
    } catch (error) {
        return next(error)
    }

    let user;
    try {
        user= await User.findOne({_id:_id})
    } catch (error) {
        return next(error)
    }

    const userDto=new userDTO(user);

    req.user=userDto

    next()
}

module.exports=auth