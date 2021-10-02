const {body} = require('express-validator')
const User = require('../../model/User')

const singupValidator = [
    body('username').isLength({min : 5 ,max :15 }).withMessage(`Username must be 5-15 chars`)
        .custom(async(username)=> {
            let user = await User.findOne({username})
            if (user) {
                return Promise.reject(`Username alreaady exist.`)
            }
        }),
    body('email').isEmail().withMessage(`Please provide a valid email`)
        .custom(async(email)=> {
            let user = await User.findOne({email})
            if (user) {
                return Promise.reject(`Email alreaady exist.`)
            }
        }).normalizeEmail(),    
    body('password').isLength({min: 7 }).withMessage(`Password must be more then 7 chars.`) ,  
    body('confirmPassword')
        .custom((confirmPassword, {req}) => {
           if (confirmPassword !== req.body.password) {
               throw new Error(`Password doesn't match`)
           }
           return true
        })
]

module.exports = singupValidator