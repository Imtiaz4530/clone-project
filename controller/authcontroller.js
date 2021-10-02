const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const Flash = require('../utility/flash')
const errFormatter = require('../utility/validateErrFormatter')
const User = require('../model/User')

exports.singupgetController =async (req, res , next) => {
    res.render('pages/auth/singup.ejs',{title : 'Singup',error:{} , value : {},flashMessage : Flash.getMessage(req)})
}

exports.singupPostController =async (req, res , next) => {
    let {username, email, password} = req.body
    const errors = validationResult(req).formatWith(errFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your form')
        return res.render('pages/auth/singup.ejs',{
            title : 'Singup',
            error : errors.mapped(),
            value : {username, email, password},
            flashMessage : Flash.getMessage(req)
        })
    }

    try {
        // const hash =await bcrypt.hash(password, 11)
        let user = new User({
            username, email, password
        })
        console.log(user);
        await user.save()
        req.flash('success', 'User created successfully')
        res.render('pages/auth/login.ejs',{title : 'Login',error : errors.mapped(),value: {}, flashMessage : Flash.getMessage(req) })
    } catch (e) {
        console.log(e);
    }
}

exports.logingetController =async (req, res , next) => {
    res.render('pages/auth/login.ejs',{title : 'Login',  error : {},value :{}, flashMessage : Flash.getMessage(req)})
}

exports.loginPostController =async (req, res , next) => {
    let {username, password} = req.body
    let errors = validationResult(req).formatWith(errFormatter)
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your form')
        return res.render('pages/auth/login.ejs',{title : 'Login', error : errors.mapped(),value : {username, password}, flashMessage : Flash.getMessage(req)})
    }
    try {
        let user = await User.findOne({username})
        if (!user) {
            req.flash('fail', 'Please Provide valid credentials')
            return res.render('pages/auth/login.ejs',{title : 'Login', error : errors.mapped(), value : {username, password},flashMessage : Flash.getMessage(req)})
        }
        // let match = await bcrypt.compare(password, user.password)
        let match = await User.findOne({password})
        if (!match) {
            req.flash('fail', 'Please Provide valid credentials')
            return res.render('pages/auth/login.ejs',{title : 'Login', error : errors.mapped(), value : {username, password}, flashMessage : Flash.getMessage(req)})
        }
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(e => {
            if (e) {
                console.log(e);
                return next(e)
            }
            req.flash('success', 'Successfully login')
            res.redirect('/dashboard')
        })
    } catch (e) {
        console.log(e)
        next(e)
    }
}

exports.logoutgetController = (req, res , next) => {
    req.session.destroy(e => { 
        if (e) {
            console.log(e)
            next(e)
        }
        res.redirect('/auth/login')
    })
}

exports.passchangeGetController =async (req, res , next) => {
    res.render('pages/auth/changePass.ejs',{title : 'Change Password',  error : {},value :{}, flashMessage : Flash.getMessage(req)})
}

exports.passchangePostController =async (req, res , next) => {
    let {oldPass, newPass, confirmpass} = req.body
    console.log(oldPass);
    try {
        let user = await User.findOne({_id:req.user._id})
        if (!user) {
            let error = new Error(`You are not an user`)
            error.status = 404
            throw error
        }
        if (user.password !== oldPass) {
            req.flash('fail', `Old-Password doesn't match`)
            return res.render('pages/auth/changePass.ejs',{title : 'Change Password',  error : {},value :{oldPass,newPass,confirmpass}, flashMessage : Flash.getMessage(req)})
        }
        if (newPass !== confirmpass) {
            req.flash('fail', `Password doesn't match`)
            return res.render('pages/auth/changePass.ejs',{title : 'Change Password',  error : {},value :{oldPass,newPass,confirmpass}, flashMessage : Flash.getMessage(req)})
        }
        await User.findOneAndUpdate({_id:req.user._id}, {$set : {password: newPass}})
        req.flash('success', 'Password changed successfully')
        res.render('pages/auth/changePass.ejs',{title : 'Change Password',  error : {},value :{}, flashMessage : Flash.getMessage(req)})
    } catch (e) {
        console.log(e);
    }
}