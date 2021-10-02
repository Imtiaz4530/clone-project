const router =  require('express').Router()

const {explorergetController, SinglePageViewController} = require('../controller/explorerController')
const {authorGetcController} = require('../controller/authorController1')

router.get('/',explorergetController)
router.get('/:postId',SinglePageViewController)

router.get('/author/:userId',authorGetcController)

module.exports = router