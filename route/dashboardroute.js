const route = require('express').Router()
const {isAuthenticate} = require('../custom middlewire/authMiddlewire')
const {dashboardGetControler,bookmarkGetControler} = require('../controller/dashboardController')

route.get('/',isAuthenticate, dashboardGetControler)
route.get('/bookmark',isAuthenticate, bookmarkGetControler)

module.exports = route