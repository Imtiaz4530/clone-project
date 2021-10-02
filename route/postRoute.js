const router = require('express').Router()
const postValidator = require('../validator/postValiadator/postValidator')
const {isAuthenticate} = require('../custom middlewire/authMiddlewire')
const multer = require('../custom middlewire/uploadMiddlewire')

const {createPostGetController, createPostPostController,editPostGetController,editPostPostController,deletePostGetController,getAllPosts} = require('../controller/postController')

router.get('/create',isAuthenticate,createPostGetController)
router.post('/create',isAuthenticate,multer.single('post-thumbnail'),postValidator,createPostPostController)

router.get('/edit/:postId',isAuthenticate,editPostGetController)
router.post('/edit/:postId',isAuthenticate,multer.single('post-thumbnail'),postValidator,editPostPostController)
router.get('/delete/:postId',isAuthenticate,deletePostGetController)

router.get('/',isAuthenticate,getAllPosts)
module.exports = router

