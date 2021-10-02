const express = require('express')
const morgan = require('morgan')
var session = require('express-session');
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session);

const {bindUserWithReq} = require('./authMiddlewire')
const setLocals = require('./setLocals')

//Express-Session
var store = new MongoDBStore({
    uri: 'mongodb://localhost/ClonePro1',
    collection: 'mySessions',
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
});

const middlewires = [
    express.json(),
    express.urlencoded({extended:true}),
    morgan('dev'),
    express.static('public'),
    session({
        secret : process.env.SECRET_KEY || "SECRET_KEY" ,
        resave : false,
        saveUninitialized: false,
        store : store
    }),
    bindUserWithReq(),
    setLocals(),
    flash()
]

module.exports = app => {
    middlewires.forEach( middlewire => {
        app.use(middlewire)
   });
}