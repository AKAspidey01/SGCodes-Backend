const nodeMailer = require('nodemailer')


const sendMail = (options) => 
    new Promise((resolve , reject) => {
        const transporter = nodeMailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            service: 'Outlook365',
            authentication: false,
            auth: {
                user: "sg83362@gmail.com",
                pass: "Ganesh@833622",
            }
        });
        const mailOptions = {
            from: "sg83362@gmail.com",
            to: options.email,
            subject: options.subject,
            html: options.html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return reject(error);
            }
            console.log("Message id", info.messageId);
            console.log("Preview URL", nodeMailer.getTestMessageUrl(info));
            return resolve({ message: "reset email has sent to your inbox" });
        });
    });


    module.exports = sendMail;