const router = require('express').Router()
const singupValidator = require('../validator/authValidator/singupValiidator')
const loginValidator = require('../validator/authValidator/loginValidator')
const {isUnAuthenticate} = require('../custom middlewire/authMiddlewire')
const {isAuthenticate} = require('../custom middlewire/authMiddlewire')

const {singupgetController,singupPostController,logingetController,loginPostController,logoutgetController,passchangeGetController,passchangePostController} = require('../controller/authcontroller')

router.get('/singup',isUnAuthenticate, singupgetController)
router.post('/singup',singupValidator, singupPostController)
router.get('/login',isUnAuthenticate, logingetController)
router.post('/login',loginValidator, loginPostController)
router.get('/logout', logoutgetController)
router.get('/changepass',isAuthenticate, passchangeGetController)
router.post('/changepass', passchangePostController)

module.exports = router