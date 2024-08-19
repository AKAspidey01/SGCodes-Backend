const mongoose = require('mongoose');

const newContactSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['FrontEnd' , 'FullStack' , 'BackEnd' , 'WebDesinger' , 'AppDeveloper' , 'AppDesinger' ]
    },
    message: {
        type: String,
    }
},
{
    timestamps: true
});


module.exports = mongoose.model('contact' , newContactSchema , 'contacts')