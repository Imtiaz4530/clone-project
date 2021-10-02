const fs = require('fs')
const Profile = require('../model/Profile')
const User = require('../model/User')

exports.uploadproPicController = async (req, res, next) => {
    if (req.file) {
        try {
            let oldpic = req.user.profilePics
            let profile = await Profile.findOne({user:req.user._id})
            let profilePics = `/upload/${req.file.filename}`
            if (profile) {
                await Profile.findOneAndUpdate({user:req.user._id}, {$set: {profilePics}})
            }
            await User.findOneAndUpdate({_id:req.user._id}, {$set: {profilePics}})
            if (oldpic !== '/upload/R.png') {
                fs.unlink( `public${oldpic}`, (e)=>{
                    console.log(e)
                })
            }
            res.status(200).json({
                profilePics
            })
        } catch(e){
            // res.status(500).json({
            //     profilePics : req.user.profilePics
            // })
            console.log(e);
        }
    }else{
        // res.status(500).json({
        //     profilePics : req.user.profilePics
        // })
    }
}

exports.removePropicController = async (req, res, next) => {
    try {
        let defaulpic = '/upload/R.png'
        let currentpic = req.user.profilePics
        fs.unlink(`public${currentpic}`, async (e) => {
        let profile = await Profile.findOne({user:req.user._id})
        if (profile) {
            await Profile.findOneAndUpdate({user:req.user._id}, {$set : {profilePics: defaulpic }})
        }
        await User.findOneAndUpdate({_id:req.user._id}, {$set : {profilePics: defaulpic }})
        res.status(200).json({
            profilePics: defaulpic
        })
    })
    } catch (e) {
        console.log(e);
    }
}

exports.postImageController = (req,res,next )=> {
    if (req.file) {
        return res.status(200).json({
            imgUrl : `/upload/${req.file.filename}`
        })}
        return res.status(500).json({
        message : 'Server Error'
        })
}