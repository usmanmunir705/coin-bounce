const express = require('express')
const {handleUserLogin,
    handleUserRegister,
    handleUserLogout,
    handleRefreshToken} = require('../controller/user')
const {createBlog,
    getAllBlog,
    getBlogById,
    updateBlog,
    deleteBlog} = require('../controller/blog')    
const {createComment,getById} = require('../controller/comment')    
const auth = require('../middleware/auth')
const router = express.Router();

// test

router.get('/test' , (req , res)=>{
    res.json({msg:'hello world!'})
})

// authentication controllers 

// register 
router.post('/register' , handleUserRegister)

// login 
router.post('/login' ,handleUserLogin)

// logout
router.post('/logout' , auth , handleUserLogout)

// refresh token
router.get('/refresh' , handleRefreshToken)

// blog controllers

// create
router.post('/blog' , auth ,  createBlog)

// get all
router.get('/blog/all' , auth , getAllBlog)

// get by id 
router.get('/blog/:id' , auth , getBlogById)

// update blog
router.put('/blog' , auth , updateBlog)

// delete 
router.delete('/blog/:id' , auth , deleteBlog)

//Comment 

//create
router.post('/comment' , auth , createComment)

//get
router.get('/comment/:id' , auth , getById)

module.exports=router;