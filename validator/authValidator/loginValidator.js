const {body} = require('express-validator')
const User = require('../../model/User')

const loginValidator = [
    body('username').not().isEmpty().withMessage(`Username cannot be empty.`),
    body('password').not().isEmpty().withMessage(`Password cannot be empty.`)
]

module.exports = loginValidator