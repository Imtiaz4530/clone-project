const {Schema, model} = require('mongoose') 

const profileSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    name : {
        type: String,
        required: true,
        maxlength : 25
    },
    bio: {
        type : String,
        required : true,
        trim: true,
        max:100
    },
    posts : [{
        type : Schema.Types.ObjectId,
        ref : 'Post'
    }],
    bookmarks : [{
        type : Schema.Types.ObjectId,
        ref : 'Post'
    }],
    profilePics : String,
    links: {
        website : String,
        facebook : String,
        github : String
    }
},{timestamps: true})

const Profile = model('Profile', profileSchema)
module.exports = Profile