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
    userName: {
        type:String,
        required:true,
    },
    firstName : {
        type:String,
    },
    lastName: {
        type:String,
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