const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'hotmail', or use custom SMTP
    auth: {
        user: process.env.EMAIL_USER, // set in .env
        pass: process.env.EMAIL_PASS  // set in .env
    }
});

const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: `"Pals Limited" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
