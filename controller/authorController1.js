const Post = require('../model/post')
const Profile = require('../model/Profile')
const User = require('../model/User')
const Flash = require('../utility/flash')

exports.authorGetcController =async (req,res,next) => {
    let userId = req.params.userId
    try {
        let author = await User.findById(userId).populate({path : 'profile', populate: {path:'posts'}})
        let profile = await Profile.findOne({user : userId})
        let posts = await Post.find({author: userId})
        res.render('pages/explorer/author.ejs', {title : 'Profile',author,profile,posts, flashMessage : Flash.getMessage(req)})
    } catch (e) {
        console.log(e)
        next(e)
    }
}
