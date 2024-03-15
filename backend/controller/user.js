const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const UserDTO=require('../dto/user')
const RefreshToken =require('../models/token')
const JWTService=require('../services/JWTService')
const passwordPattern= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

async function handleUserRegister(req , res , next){

    const {username , name , email ,password}=req.body;
    
    // 1 validate user input
    const userRegisterSchema = Joi.object({
        username:Joi.string().min(5).max(30).required(),
        name:Joi.string().max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().pattern(passwordPattern).required(),
        confirmPassword:Joi.ref('password')

    })
    const {error} = userRegisterSchema.validate(req.body)
    // 2 if error in validation -> return error via middleware
    if(error){
        return next(error)
    }
    // 3 if email or username is already registered->return an error 
    
    try {
        const emailInUse = await User.exists({email})

        const userNameInUse = await User.exists({username})

        if(emailInUse){
            const error={
                status:409,
                message:"Email already registered, use another email"
            }
            return next(error)
        }
        if(userNameInUse){
            const error={
                status:409,
                message:"username not available, choose another"
            }
            return next(error)
        }

    } catch (error) {
        return next(error)
    }
    // 4 password hashing
    const hashedPassword = await bcrypt.hash(password,10);

    // 5 user resgistration 
    let accessToken;
    let refreshToken;
    let user;
   try {
    const userToRegister = new User({
        username,
        email,
        name,
        password:hashedPassword
    })
     user =await userToRegister.save();
     // token generation
     accessToken = JWTService.signAccessToken({_id:user._id},'30m')
     refreshToken = JWTService.signRefreshToken({_id:user._id},'60m')
   } catch (error) {
    return next(error)
   }
   res.cookie('accessToken',accessToken,{
    maxAge:1000*60*60*24,
    httpOnly:true
   })
   res.cookie('refreshToken',refreshToken,{
    maxAge:1000*60*60*24,
    httpOnly:true
   })
   // store token in db
   await JWTService.storeRefreshToken(refreshToken,user._id)
    // 6 send response
    const userDto=new UserDTO(user)

    return res.status(201).json({user:userDto,auth:true})
}


async function handleUserLogin(req , res , next){
    const {username , password} = req.body;

    // 1 validate user login
    const userLoginSchema = Joi.object({
        username:Joi.string().min(5).max(30).required(),
        password:Joi.string().pattern(passwordPattern).required(),
    })
    const {error} = userLoginSchema.validate(req.body);

    if(error){
        return next(error)
    }
    // 2 match password

    let user;
    try {
         user=await User.findOne({username})
       if(!user){
        const error ={
            status:401,
            message:'Invalid username'
        }
        return next(error)
       }
       const match = await bcrypt.compare(password , user.password)
       if(!match){
        const error={
            status:401,
            message:'wrong password'
        }
        return next(error)
       }
    } catch (error) {
        return next(error)
    }
    const accessToken = JWTService.signAccessToken({_id:user._id},'30m')
    const refreshToken = JWTService.signRefreshToken({_id:user._id},'60m')

    //update refresh token
    try {
        await RefreshToken.updateOne({
            _id:user._id
        },{
            token:refreshToken
        },{
            upsert:true
        })
    } catch (error) {
        return next(error)
    }

   res.cookie('accessToken',accessToken,{
    maxAge:1000*60*60*24,
    httpOnly:true
   })
   res.cookie('refreshToken',refreshToken,{
    maxAge:1000*60*60*24,
    httpOnly:true
   })
    // 4 send response
    const userDto=new UserDTO(user)
    return res.status(200).json({user:userDto,auth:true})
}

async function handleUserLogout(req , res , next){
    const {refreshToken , accessToken} = req.cookies;
    try {
        RefreshToken.deleteOne({token:refreshToken})
    } catch (error) {
        return next(error)
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    

    res.status(200).json({user:null , auth:false})
}

async function handleRefreshToken(req , res , next){

    // 1 get refresh token from cookies
    const originalRefreshToken = req.cookies.refreshToken;

    // 2 verify refresh token
    let id;
    try {
        id=JWTService.verifyRefreshToken(originalRefreshToken)._id
    } catch (e) {
        const error ={
            status:401,
            message:'Unothorized'
        }
        return next(error)
    }
    //  verify from db
    try {
        const match = RefreshToken.findOne({_id:id , token:originalRefreshToken})

        if(!match){
            const error ={
                status:401,
                message:'Unothorized'
            }
            return next(error)
        }
    } catch (error) {
        return next(error)
    }
    // 3 generate new token 
    const accessToken = JWTService.signAccessToken({_id:id},'30m')

    const refreshToken = JWTService.signRefreshToken({_id:id},'60m') 
    
    // 4 update in db 
    
    try {
        
        await RefreshToken.updateOne({
            _id:id
        },{
            token:refreshToken
        })
        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
           })
           res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
           })

    } catch (error) {
        return next(error)
    }
    
    // 5 send response
    const user = await User.findOne({_id:id}) 
    const userDto=new UserDTO(user)
    return res.status(200).json({user:userDto,auth:true})
    


}

module.exports={
    handleUserLogin, 
    handleUserRegister,
    handleUserLogout,
    handleRefreshToken
}
