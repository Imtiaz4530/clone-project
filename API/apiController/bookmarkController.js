const Post = require("../../model/post")
const Profile = require("../../model/Profile")

exports.bookmarkController =async (req,res,nextw) => {
    let {postId} = req.params
    if (!req.user) {
        return res.json({
            error : `User not authenticate`
        })
    }
    try {
        let bookmarks = null
        let profile = await Profile.findOne({user:req.user._id})
        if (profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate({user:req.user._id}, {$pull : {'bookmarks' : postId}})
            bookmarks: true
        }else{
            await Profile.findOneAndUpdate({user:req.user._id}, {$push : {'bookmarks' : postId}})
            bookmarks: false
        }
        res.status(200).json({
            bookmarks
        })
    } catch (e) {
        console.log(e)
        next(e)
    }
}