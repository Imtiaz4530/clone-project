const { body } = require('express-validator')
const validator = require('validator')

const createProfileValidator = [
    body('name').not().isEmpty().withMessage(`Name can't be empty`)
        .isLength({max:25}).withMessage(`Name must be less then 25 chars`),
    body('bio').not().isEmpty().withMessage(`Bio can't be empty`)
        .isLength({max:100}).withMessage(`Bio can't be more then 100 chars`),
    body('website').custom(websiteURL => {
        if (websiteURL) {
            if (!validator.isURL(websiteURL)) {
                throw new error(`Invalid website url`)
            }
        }
        return true
    }),
    body('facebook').custom(facebookURL => {
        if (facebookURL) {
            if (!validator.isURL(facebookURL)) {
                throw new error(`Invalid facebook url`)
            }
        }
        return true
    }),
    body('github').custom(githubURL => {
        if (githubURL) {
            if (!validator.isURL(githubURL)) {
                throw new error(`Invalid github url`)
            }
        }
        return true
    })
]

module.exports = createProfileValidator