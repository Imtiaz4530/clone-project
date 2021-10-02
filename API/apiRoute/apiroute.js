const router = require('express').Router()
const {isAuthenticate} = require('../../custom middlewire/authMiddlewire')

const { bookmarkController } = require('../apiController/bookmarkController')
const {likeController,dislikeController} = require('../apiController/like-dislikeController')
const {commentController,replyController} = require('../apiController/commentController')

router.get('/bookmark/:postId',isAuthenticate,bookmarkController)
router.get('/like/:postId',isAuthenticate,likeController)
router.get('/dislike/:postId',isAuthenticate,dislikeController)
router.post('/comment/:postId',isAuthenticate,commentController)
router.post('/comment/replies/:commentId',isAuthenticate,replyController)

module.exports = router