let nodemailer = require('nodemailer');
require('dotenv').config();

let footer = "\n\nFrom Rafael Piloto\nSent by my Personal Assistant, A.P.O.L.L.O";

function sendEmail(to, subject, text) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    var mailOptions = {
        from: to,
        to,
        subject,
        text: text + footer
    };
    // Status = SMTP Status Codes
    let status = {};
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error while trying to send email:", error);
            status['code'] = 554 // This means that the transaction has failed. It’s a permanent error and the server will not try to send the message again.
            status['error'] = error;
        } else {
            console.log('Email sent: ' + info.response);
            status['code'] = 250; // OK
        }
    });

    transporter.close();
    return status;
}

module.exports = {
    sendEmail: sendEmail
}