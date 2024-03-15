const express = require('express')
const Joi = require('joi')
const fs = require('fs')
const {
        CLOUD_NAME,
        API_SECRET,
        API_KEY} = require('../config/index')
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const blogDTO = require('../dto/blog')
const BlogDetailsDto=require('../dto/blogdetailDto')
const mongoDbIdPattern = /^[0-9a-fA-F]{24}$/;
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });

async function createBlog(req , res , next){

    // 1 validate req body

    const createBlogSchema = Joi.object({
        title:Joi.string().required(),
        author:Joi.string().regex(mongoDbIdPattern).required(),
        content:Joi.string().required(),
        photo:Joi.string().required()
    })
    const {error} = createBlogSchema.validate(req.body)

    if(error){
        return next(error)
    }

    const {title , author , content , photo} = req.body

    // read as buffer
    //const buffer = Buffer.from(photo.replace(/^image:\/(png|jpg|jpeg);base64,/ , '') , 'base64');

    // allot a random name 
    //const imagePath = `${Date.now()}-${author}.png`

    // save locally

    try {
        response = await cloudinary.uploader.upload(photo, {
            folder: 'Blog_Data',
          });
        //fs.writeFileSync(`storage/${imagePath}` , buffer)
    } catch (error) {
        console.log(error)
        return next(error)
    }

    // save in db
    let newBlog;
    try {
        newBlog = new Blog({
            title,
            content,
            author,
            // photoPath:`${BACKEND_SERVER_PATH}/storage/${imagePath}`
            photoPath:response.url
        })

        await newBlog.save()
    } catch (error) {
        return next(error)
    }

    const blogDto = new blogDTO(newBlog);

    res.status(201).json({blog:blogDto})
}

async function getAllBlog(req , res , next){
    const blogs = await Blog.find({});
    try {
        const blogsDto = [];
    for(let i=0 ; i<blogs.length ; i++){
        const dto=new blogDTO(blogs[i])
        blogsDto.push(dto);
    }
    return res.status(200).json({blogs:blogsDto})
    } catch (error) {
        return next(error)
    }
    
}
async function getBlogById(req , res , next){

    // validate id 
    const getByIdSchema = Joi.object({
        id:Joi.string().regex(mongoDbIdPattern).required()
    })
    const {error} = getByIdSchema.validate(req.params);
    if(error){
        return next(error)
    }

    let blog;

    const {id}= req.params
    try {
    blog = await Blog.findOne({_id:id}).populate('author')
    } catch (error) {
        return next(error)
    }
    const blogDetailDto = new BlogDetailsDto(blog);

    return res.status(200).json({blog:blogDetailDto})
}

async function updateBlog(req , res , next){
    // validate
    const updateBlogSchema=Joi.object({
        title:Joi.string().required(),
        content:Joi.string().required(),
        author:Joi.string().regex(mongoDbIdPattern).required(),
        blogId:Joi.string().regex(mongoDbIdPattern).required(),
        photo:Joi.string()

    })
    const {error} = updateBlogSchema.validate(req.body)

    if(error){
        return next(error)
    }

    const {title , content , author , blogId , photo} = req.body;
    // delete previous photo
    // save photo

    let blog;
    try {
         blog = await Blog.findOne({_id:blogId})
    } catch (error) {
        return next(error)
    }

    if(photo){
        let previousPhoto = blog.photoPath;
        previousPhoto=previousPhoto.split('/').at(-1)

        // delete photo 
       // fs.unlinkSync(`storage/${previousPhoto}`)
        // read as buffer
    //const buffer = Buffer.from(photo.replace(/^image:\/(png|jpg|jpeg);base64,/ , '') , 'base64');

    // allot a random name 
    //const imagePath = `${Date.now()}-${author}.png`

    // save locally
    let response;
    try {
       // fs.writeFileSync(`storage/${imagePath}` , buffer)
       

        response = await cloudinary.uploader.upload(photo);
    } catch (error) {
        return next(error)
    }
    await Blog.updateOne({_id:blogId},{
        title,
        content,
        // photoPath:`${BACKEND_SERVER_PATH}/storage/${imagePath}`
        photoPath:response.url
    })
    return res.status(200).json({message:'blog updated'})
    }
    else{
        await Blog.updateOne({_id:blogId},{
            title,
            content,
        })

        return res.status(200).json({message:'blog updated'})
    }
    
}

async function deleteBlog(req , res , next){
    //validate id
    

    const deleteBlogSchema = Joi.object({
        id:Joi.string().regex(mongoDbIdPattern).required()
    })
    const {error} = deleteBlogSchema.validate(req.params)

    if(error){
        return next(error)
    }

    const {id} = req.params

    // delete blog 
    // delete comment on that block

    try {
        await Blog.deleteOne({_id:id})

        await Comment.deleteMany({blog:id})
    } catch (error) {
        return next(error)
    }
    return res.status(200).json({messge:'blog deleted'})
}
module.exports={
    createBlog,
    getAllBlog,
    getBlogById,
    updateBlog,
    deleteBlog
}