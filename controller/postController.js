const {validationResult} = require('express-validator')
const Flash = require('../utility/flash')
const errFormatter = require('../utility/validateErrFormatter')
const Profile = require('../model/Profile')
const Post = require('../model/post')
const readingTime = require('reading-time')



exports.createPostGetController = (req,res,next) => {
    res.render('pages/posts/createPost.ejs',{title : "Create Post", error:{}, value:{},flashMessage : Flash.getMessage(req)})
}

exports.createPostPostController = async (req,res,next) => {
    let { title, body, tags} = req.body
    const errors = validationResult(req).formatWith(errFormatter)
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check post')
        return res.render('pages/posts/createPost.ejs',{title : "Create Post", error: errors.mapped() , value:{title, body, tags} ,flashMessage : Flash.getMessage(req)})
    }
    try {
        if (tags) {
            tags = tags.split(",")
            tags = tags.map(t => t.trim())
        }
        let readtime = readingTime(body).text
        let post = new Post({
            title, body , tags, readtime, likes :[], dislikes: [], comments:[],
            author: req.user._id, thumbnail: ''
        })
        if (req.file) {
            post.thumbnail = `/upload/${req.file.filename}`
        }
        let createdPost = await post.save()
        let profile = await Profile.findOneAndUpdate({user:req.user._id},{$push: {'posts': createdPost._id }})
        req.flash('success', 'Post created successfully')
        res.redirect(`/posts/edit/${createdPost._id}`)
    } catch (e) {
        console.log(e);
        next(e)
    }
}

exports.editPostGetController =async (req,res,next) => {
    let postID = req.params.postId
    try {
        let post = await Post.findOne({author:req.user._id , _id:postID})
        if (!post) {
            let error = new Error('No post found')
            error.status(404)
            throw error
        }
        res.render('pages/posts/editPost.ejs',{title : "Edit Post", error:{}, post ,flashMessage : Flash.getMessage(req)})
    } catch (e) {
        console.log(e);
        next(e)
    }
}

exports.editPostPostController = async (req,res,next) => {
    let { title, body, tags } = req.body
    let  postID = req.params.postId
    const errors = validationResult(req).formatWith(errFormatter)
    try {
        let post = await Post.findOne({author:req.user._id , _id:postID})
        if (!post) {
            let error = new Error('No post found')
            error.status(404)
            throw error
        }
        if (!errors.isEmpty()) {
            req.flash('fail', 'Please check post')
            return res.render('pages/posts/editPost.ejs',{title : "Edit Post", error: errors.mapped() , post , value:{title, body, tags} ,flashMessage : Flash.getMessage(req)})
        }
        if (tags) {
            tags = tags.split(",")
            tags = tags.map(t => t.trim())
        }
        let thumbnail = post.thumbnail
        if (req.file) {
            thumbnail = req.file.filename
        }
        let updatePost = await Post.findByIdAndUpdate({_id:post._id}, {$set : {  title, body, tags, thumbnail }})
        req.flash('success', 'Post updated successfully')
        res.redirect('/posts/edit/' + post._id )
    } catch (e) {
        console.log(e)
        next(e)
    }
}

exports.deletePostGetController = async (req,res,next) => {
    let postID = req.params.postId
    try {
        let post = await Post.findOne({author:req.user._id,_id:postID})
        if (!post) {
            let error = new Error(`Post not found`)
            error.status = 404
            throw error 
        }
        await Post.findOneAndDelete({_id:postID})
        await Profile.findOneAndUpdate({user:req.user._id}, {$pull: {'posts':postID}})
        req.flash('success', 'Post deleted')
        res.redirect('/posts')
    } catch (e) {
        console.log(e)
        next(e)
    }
}

exports.getAllPosts = async (req,res,next) => {
try {
    let posts = await Post.find({author:req.user._id})
    res.render('pages/posts/allPost.ejs',{title : "My post", posts ,flashMessage : Flash.getMessage(req)})
} catch (e) {
    console.log(e)
}
}

