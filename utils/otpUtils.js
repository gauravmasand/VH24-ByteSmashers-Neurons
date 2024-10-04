const nodemailer = require('nodemailer');

const sendOtpToEmail = async (email, otp) => {
  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Replace with your hosting provider's SMTP host
    port: 465, // Commonly used port for SMTP
    secure: true, // Use true if using port 465, false otherwise
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // Your email password or app password
    }
  });

  // Define the email options
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. This code will expire in 5 minutes.`
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpToEmail };