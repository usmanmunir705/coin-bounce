
const Joi = require('joi')
const Comment = require('../models/comment')
const commentDto = require('../dto/comment')
const mongoDbIdPattern = /^[0-9a-fA-F]{24}$/;

async function createComment(req , res , next){
    const createCommentSchema=Joi.object({
        content:Joi.string().required(),
        author:Joi.string().regex(mongoDbIdPattern).required(),
        blog:Joi.string().regex(mongoDbIdPattern).required()
    })
    const {error} = createCommentSchema.validate(req.body)

    if(error){
        return next(error)
    }

    const{content , author , blog} = req.body;

    try {
        const newComment = new Comment({
            content,
            author,
            blog,
        })
        await newComment.save();
    } catch (error) {
        return next(error)
    }
    return res.status(201).json({message:'commented'})
}

async function getById(req , res , next){
    const getByIdschema = Joi.object({
        id:Joi.string().regex(mongoDbIdPattern).required()
    }) 
    const {error} = getByIdschema.validate(req.params)

    if(error){
        return next(error)
    }

    const {id} = req.params

    let comments
    try {
     comments = await Comment.find({blog:id}).populate('author')
    } catch (error) {
        return next(error)
    }
    let commentsDto = [];
    for(let i=0 ; i<comments.length;i++){
        const obj = new commentDto(comments[i]);
        commentsDto.push(obj)
    }
    return res.status(200).json({data:commentsDto})
}

module.exports={
    createComment,
    getById
}