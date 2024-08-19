const express = require("express");
const app = express();
const fs = require("fs")
const jwt = require("jsonwebtoken")
const passwordValidator = require('password-validator');
const mongoose = require('mongoose');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const constants = require('../utilities/constants');
const sendMail = require('../middlewares/mailer');
const schema = new passwordValidator();
const otpGenerator = require('otp-generator')




schema.is().min(8).is().max(100).has().uppercase().has().lowercase().has().digits(2);




exports.userSignIn = async (req, res) => {
    try {
        const user = req.body;
        const isUserExist = await userModel.findOne({ email: req.body.email }).lean();
        if (!isUserExist) {
            return res.status(400).send({
                data: null,
                error: "Email Doesn't Exists",
                status: 0,
                message: "User with mail Doesn't  Exists"
            })
        };

        const isPasswordMatches = await bcrypt.compare(req.body.password, isUserExist.password);

        if (!isPasswordMatches) {
            return res.status(400).send({
                data: null,
                error: 'Incorrect Password',
                status:0 ,
                message: 'Enter Valid Password',
            })
        }
        const token = jwt.sign({ authId: isUserExist._id }, process.env.JWT_TOKEN_KEY);
        res.status(200).send({
            data:{ user: 
                    {
                        email: isUserExist.email , 
                        _id: isUserExist._id , 
                        userName: isUserExist.username,
                        // lastName: isUserExist.lastName,
                        mobileNumber: isUserExist.mobileNumber,
                        profileImage: isUserExist.profileImage,
                        createdAt: isUserExist.createdAt,
                        updatedAt: isUserExist.updatedAt
                    } , 
            token: token },
            error: null,
            status: 1,
            message: 'Login Succuessfull'
        })
    } 
    catch (error) {
        console.log(error)
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: 'Error in Logging the User'
        })
    }
    
};

const mailTemplate = (data) => {
    const html =
    `<html>
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

            body {
              font-family: "Manrope", sans-serif !important;
              color: rgba(25, 29, 35, 1);
            }
            p {
              font-size: 14px;
              line-height: 24px;
              margin-top: 0px;
              font-family: "Manrope", sans-serif !important;
              font-weight: 500;
            }
            .main_div {
              height: 100vh;
              width: 100%;
              background-color: rgba(229, 244, 240, 1);
            }
            .outer {
              background-color: #fff;
              border-radius: 6px;
              padding: 80px 40px 40px 40px;
              width: 40%;
              margin: auto;
            }
            .img_div {
              text-align: center;
            }
            h4 {
              font-family: "Manrope", sans-serif !important;
              font-size: 20px;
              font-weight: 700;
              margin-top: 10px;
              text-align: center;
              margin-bottom: 30px;
            }
            .mb-1 {
              margin-bottom: 10px;
            }
            .w-600 {
              font-weight: 600;
            }
            h6 {
              font-family: "Manrope", sans-serif !important;
              font-size: 15px;
              margin-bottom: 5px;
            }
            h2 {
              font-family: "Manrope", sans-serif !important;
              margin-top: 0px;
              font-weight: 800;
              letter-spacing: 3px;
            }
          </style>
        </head>
        <body>
        <table class="main_div" align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div class="outer">
              <div class="img_div">
                <h2 style="">SGCODES</h2>
              </div>
              <h4>Your Signer Identity</h4>
              <p class="mb-1">Hello <b>${data?.userName},</b></p>
              <p>The OTP for creating account in SGCodes for
                <span class="w-600">"${data?.email}"</span> Registration 
                <span class="w-600">Please Enter this otp to Register Account</span>.
              </p>
              <h6 class="w-600">Your verification Code</h6>
              <h2 class="otp">${data?.otp}</h2>
            </div>
          </td>
        </tr>
      </table>
        </body>
      </html>
      `
  return html;
}


exports.userSignUp = async (req, res) => {
    try {
        req.body.profileImage = req.file.path;
        req.body.password = await bcrypt.hash(req.body.password , 10)
        const isUserExist = await userModel.findOne({ email: req.body.email });
        if (isUserExist) {
            return res.status(401).send({
                data: null,
                error: 'Email Exists',
                status: 0,
                message: 'Email Already Exists'
            })
        }
        req.body.otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const userSignup = new userModel(req.body);
        const isUserCreated = await userSignup.save();
        sendMail({
            html: mailTemplate(isUserCreated),
            subject: 'New Registration For SGCODES Received',
            email: isUserCreated.email,
        })
        res.status(200).send({
            data: { user: isUserCreated },
            error: null,
            status: 1,
            message: 'Account Created Succuessfully'
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: 'Error in creating the User'
        })
    }
};

exports.verifyOtp = async(req , res) => {
    try {
        const user = await userModel.findOne({email: req.body.email});
        if(user){
           if(req.body.otp === user.otp) {
            res.status(200).send({
                data: { user: user },
                error: null,
                status: 1,
                message: 'OTP Verified Successfully'
            })
           }else {
            res.status(400).send({
                data: null,
                error: null,
                status: 0,
                message: 'Enter Valid OTP'
            })
           }
        }else {
            res.status(400).send({
                data: null,
                error: null,
                status: 0,
                message: 'User Not Found With Entered Mail'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: 'Error in Verifying OTP'
        })
    }
}

exports.updateUser = async (req, res) => {

    try {
        const user = req.body;   
        if(req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10); 
        }  
        if(req.file) {
            user.profileImage = req.file.path
        }        
        const userUpdated = await userModel.findOneAndUpdate({ _id: req.body.userId }, user, { new: true , upsert : true})
        res.status(201).send({
            data: { userdata: userUpdated },
            error: null,
            status: 1,
            message: 'User Updated Sucessfully'
        })
        } catch (error) {
            console.log(error)
        res.status(400).send({
            
            data: null,
            error: 0,
            status: constants.error,
            message: 'Error in Updating the User'
        })
    }
};




exports.getById = async (req , res) => {
    try {
     const user = await userModel.findOne({_id : req.params.userId})
    res.status(200).send({
        data: { user: user },
        error: null,
        status: 1,
        message: 'Got the User Sucessfully'
    })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: 'Error in getting the User'
        })
    }
};

exports.getAll = async (req , res) => {
    try {

        const user = await userModel.find();
        const totalUser = await userModel.countDocuments();

        res.status(200).send({
            data: { user: user, totalUser: totalUser },
            error: null,
            status: 1,
            message: 'All the Users Collected Sucessfully'
        })

    }
    catch (error) {
        res.status(401).send({
            data: null,
            error: error,
            status: 0,
            message: 'Error in getting the Users'
        })
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await userModel.findOneAndDelete({ _id: req.params.userId})
        fs.unlink(deleteUser.profileImage, (err) => {
            if (err) throw err;
        })
        res.status(200).send({
            data: deleteUser,
            error: null,
            status: 1,
            message: 'Notes Deleted Sucessfully'
        })
    }
    catch (error) {
        console.log(error)
        res.status(401).send({
            data: null,
            error: error,
            status: 0,
            message: 'Error in deleting the Notes'
        })
    }
}