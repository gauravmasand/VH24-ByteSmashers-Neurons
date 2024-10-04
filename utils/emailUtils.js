const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Replace with your hosting provider's SMTP host
    port: 465, // Commonly used port for SMTP
    secure: true, // Use true if using port 465, false otherwise
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const sendVerificationEmail = (email, userId) => {
  const verificationToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  const verificationLink = `http://localhost:5000/api/verify-email?token=${verificationToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the link: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending verification email:', err);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

module.exports = { sendVerificationEmail };