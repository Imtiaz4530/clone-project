const Profile = require('../model/Profile');
const Post = require('../model/post')
const Flash = require('../utility/flash')

exports.dashboardGetControler =async (req, res, next) => {
    try {
        let posts = await Post.find({author:req.user._id})
        let profile = await Profile.findOne({user:req.user._id}).populate('bookmarks', 'title thumbnail')
        if (profile) {
            res.render('pages/dashboard/dashboard.ejs', {title : 'Dashboard', posts:posts.reverse().slice(0, 3),bookmarks:profile.bookmarks.reverse().slice(0, 3), flashMessage : Flash.getMessage(req)})
        }else{
            res.redirect('/profile/create')
        }
    } catch (e) {
        console.log(e);
    }
}

exports.bookmarkGetControler =async (req, res, next) => {
    try {
        let profile = await Profile.findOne({user:req.user._id}).populate('bookmarks', 'title thumbnail')
        res.render('pages/dashboard/bookmark.ejs', {title : 'Bookmarks',profile, flashMessage : Flash.getMessage(req)})
    } catch (e) {
        console.log(e);
    }
}