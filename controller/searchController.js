const Post = require("../model/post")
const Flash = require('../utility/flash')

exports.searchGetController =async (req,res,next) => {
    let searchTerm = req.query.term
    
    let currentPage = parseInt(req.query.page) || 1
    let itemperpage = 10 

    try {
        let posts = await Post.find({$text : {$search : searchTerm}}).skip((itemperpage * currentPage)-itemperpage).limit(itemperpage)
        let totalPost = await Post.countDocuments({$text : {$search: searchTerm}})
        let totalPage = totalPost / itemperpage 
        res.render('pages/explorer/search.ejs', {title: 'Search', flashMessage : Flash.getMessage(req),
        searchTerm, 
        currentPage,totalPage, posts
        })
        
    } catch (e) {
        console.log(e)
        next(e)
    }
}