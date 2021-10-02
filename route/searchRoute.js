const router = require('express').Router()

const {searchGetController} = require('../controller/searchController')

router.get('/',searchGetController)

module.exports = router