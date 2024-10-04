const otpStore = {}; // Temporary storage for OTPs (in-memory)
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Generate OTP
exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
exports.sendOtp = (phoneNumber, otp) => {
  return client.messages.create({
    body: `Your OTP is ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
};

// Verify OTP
exports.verifyOtp = (phoneNumber, otp) => {
  return otpStore[phoneNumber] && otpStore[phoneNumber] === otp;
};