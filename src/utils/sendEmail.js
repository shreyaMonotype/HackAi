const nodemailer = require('nodemailer');

async function sendEmail({mailOptions}){
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'testmail4635@gmail.com',
            pass: 'gilfjzucufopieyp'
        }
    });
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
}

module.exports = {
    sendEmail
}