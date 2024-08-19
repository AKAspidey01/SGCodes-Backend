const mongoose = require('mongoose');
const express = require('express');
const contactModel = require('../models/contact.model');
const sendMail = require('../middlewares/mailer');





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
              <h2 class="otp">${data?.role}</h2>
            </div>
          </td>
        </tr>
      </table>
        </body>
      </html>
      `
  return html;
}


exports.createUserContact = async(req, res) => {
    try {
        const contactedUser = new contactModel(req.body);
        const isUserContacted = await contactedUser.save();
        sendMail({
            html: mailTemplate(isUserContacted),
            subject: 'A User Contacted You From SGCodes',
            email: 'sg654415@gmail.com',
        })
        res.status(200).send({
            data: { userContacted : isUserContacted },
            error: null,
            status: 1,
            message: 'contact Created Successfully'
        })
    } 
    catch (error) {
        console.log(error)
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: 'Error in Creating the contact'
        })
    }
}



exports.getAllUserContacts = async(req  , res) => {
    try {
        const contactUsers = await contactModel.find();
        const totalContacters = await contactModel.countDocuments();

        res.status(200).send({
            data: {contacted: contactUsers , totalContacted: totalContacters},
            status: 1,
            error: null,
            message: "Successfully Got the Contacted Users"
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Getting All User Contacts"
        })
    }
}


exports.getContactedById = async(req , res) => {
    try {
        const contactedUser = await contactModel.findOne({_id: req.params.contactId});
        res.status(200).send({
            data: { contacted: contactedUser },
            status: 1,
            error: null,
            message: "Successfully Got the Contacted User"
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Getting Contacted By Id"
        })   
    }
}


exports.deleteContactedById = async(req, res) => {
    try {
        const contactedUser = await contactModel.findOneAndDelete({_id: req.params.contactId});
        res.status(200).send({
            data: { contacted: contactedUser },
            status: 1,
            error: null,
            message: "Successfully Deleted the Contacted User"
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Deleting Contacted"
        })   
    }
}