const Post = require("../../model/post")

exports.likeController =async (req,res,next) => {
    let {postId} = req.params
    if (!req.user) {
        return res.json({error: (`You are not an authenticate user`)})
    }
    try {
        let user = req.user._id
        let liked = null
        let post = await Post.findById({_id:postId})
        if (post.dislikes.includes(user)) {
            await Post.findOneAndUpdate({_id:postId},{$pull : {'dislikes':user}})
        }
        if (post.likes.includes(user)) {
            await Post.findOneAndUpdate({_id:postId},{$pull : {'likes':user}})
            liked : false
        }else{
            await Post.findOneAndUpdate({_id:postId},{$push : {'likes':user}})
            liked : true
        }
        let updatePost = await Post.findById({_id:postId})
        res.status(200).json({
            liked, totalLike : updatePost.likes.length,
            totalDislikes : updatePost.dislikes.length
        })
    } catch (e) {
        console.log(e);
    }
}

exports.dislikeController =async (req,res,next) => {
    let {postId} = req.params
    if (!req.user) {
        return res.json({error: (`You are not an authenticate user`)})
    }
    try {
        let user = req.user._id
        let disliked = null
        let post = await Post.findById({_id:postId})
        if (post.likes.includes(user)) {
            await Post.findOneAndUpdate({_id:postId},{$pull : {'likes':user}})
        }
        if (post.dislikes.includes(user)) {
            await Post.findOneAndUpdate({_id:postId},{$pull : {'dislikes':user}})
            disliked : false
        }else{
            await Post.findOneAndUpdate({_id:postId},{$push : {'dislikes':user}})
            disliked : true
        }
        let updatePost = await Post.findById({_id:postId})
        res.status(200).json({
            disliked, totalLike : updatePost.likes.length,
            totalDislikes : updatePost.dislikes.length
        })
    } catch (e) {
        console.log(e);
    }
}