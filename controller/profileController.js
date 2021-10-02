const Profile = require('../model/Profile')
const Flash = require('../utility/flash')
const {validationResult} = require('express-validator')
const errFormatter = require('../utility/validateErrFormatter')
const User = require('../model/User')

exports.createProfileGetController =async(req, res, next) => {
    let profile = await Profile.findOne({user:req.user._id})
        if (profile) {
            res.redirect('/profile/edit')
        }else{
            res.render('pages/profile/createProfile.ejs', {title: 'Create Profile', error: {}, value:{},flashMessage : Flash.getMessage(req)})
        }
}

exports.createProfilePostController =async (req, res, next) => {
    let {name, email, bio, website, facebook, github} = req.body
    let errors = validationResult(req).formatWith(errFormatter)
    if (!errors.isEmpty()){
        req.flash('fail', 'Please check your form')
        res.render('pages/profile/createProfile.ejs', {title: 'Create profile',error: errors.mapped() , value:{}, flashMessage : Flash.getMessage(req)})
    }
    try {
        let profile =new Profile({
            user: req.user._id,
            name,email, bio, posts : [], bookmarks:[], 
            links : {
            website : website || '',
            facebook: facebook || '',
            github: github || ''
            },
            profilePics :req.user.profilePics 
        })
        let createdProfile = await profile.save()
        const user = await User.findOneAndUpdate({_id:req.user._id},{$set: {profile: createdProfile._id }})
        req.flash('success', 'Profile created successfully')
        res.redirect('/dashboard')
    } catch (e) {
        console.log(e)
        next(e)
    }
}

exports.editProfileGetController =async(req, res, next) => {
    try {
        let profile = await Profile.findOne({user:req.user._id})
        res.render('pages/profile/editProfile.ejs', {title: 'Edit Profile', error: {}, profile ,flashMessage : Flash.getMessage(req)})   
    } catch (e) {
        console.log(e);
    }
}

exports.editProfilePostController =async (req, res, next) => {
    let {name, bio, website, facebook, github} = req.body
    let errors = validationResult(req).formatWith(errFormatter)
    if (!errors.isEmpty()){
        req.flash('fail', 'Please check your form')
        return res.render('pages/profile/editProfile.ejs', {title: 'Edit profile',
        error: errors.mapped() , 
        profile :{name,bio,links:{website,facebook,github}}, 
        flashMessage : Flash.getMessage(req)})
    }
    try {
        let profile ={
            name,bio,
            links : {
            website : website || '',
            facebook: facebook || '',
            github: github || ''
            }
        }
        const upprofile = await Profile.findOneAndUpdate({user:req.user._id},{$set: profile}, {new:true})
        req.flash('success', 'Profile updated')
        res.render('pages/profile/editProfile.ejs',{title: 'Edit Profile', error: {}, profile:upprofile ,flashMessage : Flash.getMessage(req)})
    } catch (e) {
        console.log(e)
        next(e)
    }
}

