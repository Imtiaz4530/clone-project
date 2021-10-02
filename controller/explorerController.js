const Flash = require('../utility/flash')
const moment = require('moment')
const Profile = require('../model/Profile')
const Post = require('../model/post')
const Comment = require('../model/Comment')
const readingTime = require('reading-time')

let getDate = (days) => {
    let date = moment().subtract(days, 'days')
    return date.toDate()
}
genarateFilterObject = (filter)=> {
    let filterObj = {}
    let order = 1

    switch (filter) {
        case 'week': {
            filterObj = {
                createdAt: {
                    $gt : getDate(7)
                }
            }
            order = -1
            break
        }
        case 'month': {
            filterObj = {
                createdAt: {
                    $gt : getDate(30)
                }
            }
            order = -1
            break
        }
        case 'all': {
            order = -1
            break
        }
    }
    return {filterObj , order}
}

exports.explorergetController =async (req,res,next) => {
    let filter = req.query.filter || 'latest'
    let currentPage = parseInt(req.query.page) || 1
    let itemPerpage = 10
    let {filterObj , order} = genarateFilterObject(filter.toLowerCase())
    try {
        let posts = await Post.find({filterObj}).populate('author', 'username')
                                    .sort(order === 1 ? '-createdAt' : 'createdAt')
                                    .skip((itemPerpage * currentPage) - itemPerpage)
                                    .limit(itemPerpage)
        let totalPost = await Post.countDocuments()
        let totalPage = totalPost / itemPerpage
        let bookmarks = []
        if (req.user) {
            let profile = await Profile.findOne({user: req.user._id})
            if (profile) {
                let bookmarks = profile.bookmarks
            }
        }
        res.render('pages/explorer/explorer.ejs',{title : "Explorer",filter,currentPage,totalPage,posts,bookmarks,flashMessage : Flash.getMessage(req)})
    } catch (e) {
        console.log(e);
        next(e)
    }
}

exports.SinglePageViewController =async (req,res,next) => {
    let { postId } = req.params
    try {
        let post = await Post.findById({_id:postId}).populate("author", 'username')
                                                    .populate({path: 'comments',
                                                    populate : {
                                                        path : 'user',
                                                        select : 'username profilePics'
                                                    }}).populate({
                                                        path: 'comments',
                                                        populate : {
                                                            path : 'replies.user',
                                                            select : 'username profilePics'
                                                        }
                                                    })
        if (!post) {
            let error = new Error (`404 page not found`)
            error.status = 404
            throw error
        }
        let bookmarks = []
        if (req.user) {
            let profile = await Profile.findOne({user: req.user._id})
            if (profile) {
                let bookmarks = profile.bookmarks
            }
        }
        res.render('pages/explorer/singlePageView.ejs', {title : "singlePageView",post,bookmarks,flashMessage : Flash.getMessage(req)})
    } catch (e) {
        console.log(e);
        next(e)
    }
}