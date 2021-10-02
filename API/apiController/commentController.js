const Post = require('../../model/post')
const Comment = require('../../model/Comment')

exports.commentController = async(req,res,next) => {
    let {postId} = req.params
    let {body} = req.body
    if (!req.user) {
        res.json({
            error : (`You are not an authenticate user`)
        })
    }
    try {
        let comment = new Comment({
            post: postId,
            user: req.user._id,
            body,
            replies : []
        })
        let createdComment = await comment.save()
        await Post.findOneAndUpdate({_id:postId}, {$push: {"comments":createdComment._id} })
        let commentJson = await Comment.findById({_id:createdComment._id}).populate('user', 'username profilePics')
        res.status(200).json(commentJson)
    } catch (e) {
        console.log(e)
        next(e)
    }
}

exports.replyController = async(req,res,next) => {
    let {commentId} = req.params
    let {body} = req.body
    if (!req.user) {
        return res.json({
            error : (`You are not an authenticate user`)
        })
    }
    let reply ={
        user: req.user._id,
        body,
        profilePics : req.user.profilePics,
        username:req.user.username
    }
    try {
        let comment = await Comment.findOneAndUpdate({_id:commentId},{$push : {'replies': reply }}).populate({
                                                                                                    path: 'user',
                                                                                                    select: 'profilePics username'
                                                                                                    }).populate({path: 'replies',
                                                                                                        select : 'username profilePics'
                                                                                                    })
        res.status(200).json({
            ...reply,
            profilePics : req.user.profilePics,
            username:req.user.username
        })
        console.log(reply.username);
    } catch (e) {
        console.log(e)
        next(e)
    }
}