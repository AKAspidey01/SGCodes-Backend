const mongoose = require('mongoose');


const userAuthSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8
    },
    username: {
        type:String,
        required:true,
    },
    firstName : {
        type:String,
        required:true,
    },
    lastName: {
        type:String,
        required:true,
    },
    mobileNumber: {
        type: String,
        required:true,
    },
    profileImage : {
        type:String,
        required:false,
    },
    otp: {
        type: Number
    }
},
{
    timestamps: true
});


module.exports = mongoose.model('user' , userAuthSchema , 'users')