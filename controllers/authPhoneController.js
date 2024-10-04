const User = require('../models/User');
const otpService = require('../utils/otpService');
const locationService = require('../utils/locationService');

// Request OTP
exports.requestOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const otp = otpService.generateOtp();
    // Send OTP via SMS (using Twilio or similar service)
    await otpService.sendOtp(phoneNumber, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

// Verify OTP and Signup
exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otp, name } = req.body;
  try {
    const isValidOtp = otpService.verifyOtp(phoneNumber, otp);
    if (!isValidOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Get IP address and fetch location details
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = await locationService.getLocation(ipAddress);

    // Create new user
    const newUser = new User({
      name,
      phoneNumber,
      ipAddress,
      location,
      signupDate: new Date()
    });
    await newUser.save();

    res.status(201).json({ message: 'User signed up successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error signing up', error: err.message });
  }
};