const router = require('express').Router()
const {isAuthenticate} = require('../custom middlewire/authMiddlewire')
const uploadMiddlewire = require('../custom middlewire/uploadMiddlewire')

const {uploadproPicController, removePropicController} = require('../controller/uploadController')

router.post('/propic',isAuthenticate,uploadMiddlewire.single('profilePics'),uploadproPicController)
router.delete('/propic',isAuthenticate,removePropicController)

router.post('/postImage',uploadMiddlewire.single('post-image'),uploadproPicController)

module.exports = router 