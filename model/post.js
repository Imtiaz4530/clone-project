const {Schema, model} = require('mongoose') 

const postSchema = new Schema({
    author : {
        type : Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    title:{
        type : String,
        required : true,
        maxlength : 100,
        trim : true
    },
    body :{
        type : String,
        required : true,
        maxlength : 5000,
        trim : true
    },
    tags : {
        type:[String]
    },
    thumbnail : String,
    readtime : String,
    likes : [
        {type : Schema.Types.ObjectId,
        ref : 'User'}
    ],
    dislikes : [
        {type : Schema.Types.ObjectId,
            ref : 'User'}
    ],
    comments : [
        {type : Schema.Types.ObjectId,
            ref : 'Comment'}
    ]
},{timestamps: true})
postSchema.index({
    title : 'text',
    body : 'text',
    tags : 'text',
},{weights : {
title : 5,
body : 5,
tags : 3,
}})

const Post = model('Post', postSchema)
module.exports = Post