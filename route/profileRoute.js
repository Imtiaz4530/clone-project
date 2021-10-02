const router = require('express').Router()
const {isAuthenticate} = require('../custom middlewire/authMiddlewire')
const profilevalidator = require('../validator/profileValidate/ProfileValidator')

const {createProfileGetController, createProfilePostController, editProfileGetController, editProfilePostController} = require('../controller/profileController')

router.get('/create',isAuthenticate,createProfileGetController)
router.post('/create',isAuthenticate,profilevalidator,createProfilePostController)
router.get('/edit',isAuthenticate,editProfileGetController)
router.post('/edit',isAuthenticate,profilevalidator,editProfilePostController)

module.exports = router