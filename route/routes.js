const dashboard = require('./dashboardroute')
const auth = require('./authRoute')
const profile = require('./profileRoute')
const upload = require('./uploadRoute')
const posts = require('./postRoute')
const search = require('./searchRoute')
const explorer = require('./explorerRoute')
const api = require('../API/apiRoute/apiroute')

const allroutes = [
    {
        path: '/auth',
        handler: auth
    },
    {
        path: '/profile',
        handler: profile
    },
    {
        path: '/explorer',
        handler: explorer
    },
    {
        path: '/upload',
        handler: upload
    },
    {
        path: '/dashboard',
        handler: dashboard
    },
    {
        path: '/search',
        handler: search
    },
    {
        path: '/posts',
        handler: posts
    },
    {
        path: '/api',
        handler: api
    },
    {
        path : '/',
        handler: (req, res) => {
            res.send (`<h1>Explorer soon<h1>`)
        }
    }
] 

module.exports = (app)=> {
    allroutes.forEach(route => {
        if (route.path === '/') {
            app.get(route.path, route.handler)
        }else{
            app.use(route.path, route.handler)
        }
    })
}